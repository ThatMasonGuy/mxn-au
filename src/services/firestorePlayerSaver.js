// @/services/firestorePlayerData.js
import { preparePlayerEventData } from '../utils/prepPlayerEventData';
import { shouldSavePlayer } from '../utils/cleanNumber';
import { firestore } from '@/firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';

// Helper function to safely convert to number, returning null for invalid values
const safeNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

// Helper function to safely get string value, returning null for undefined
const safeString = (value) => {
  if (value === undefined || value === null || value === '') return null;
  return String(value);
};

// Helper function to recursively remove undefined values from nested objects and arrays
const deepSanitize = (obj, path = '') => {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.map((item, index) => deepSanitize(item, `${path}[${index}]`)).filter(item => item !== undefined);
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (value === undefined) {
        console.warn(`[DEEP_SANITIZE] Removing undefined field at "${currentPath}"`);
        continue;
      }

      const sanitizedValue = deepSanitize(value, currentPath);
      if (sanitizedValue !== undefined) {
        sanitized[key] = sanitizedValue;
      }
    }
    return sanitized;
  }

  return obj;
};

// Helper function to remove undefined values from an object (keeping for backwards compatibility)
const sanitizeObject = (obj) => {
  return deepSanitize(obj);
};

export const savePlayerToFirestore = async (player, currentEvent) => {
  if (!player || !currentEvent || !currentEvent.id) return { skipped: true };

  const eventId = String(currentEvent.id);
  const isGR = (currentEvent?.type === 'GR');

  const dayFields = ['scoreD1', 'scoreD2', 'scoreD3', 'scoreD4', 'scoreD5', 'scoreD6'];
  const hasGvGScores =
    dayFields.some(f => Number(player?.[f]) > 0) || Number(player?.overallScore) > 0;
  const hasGRScore = Number(player?.score) > 0;

  const baselineThinksHasScores = shouldSavePlayer(player);
  const eventAwareHasScores = isGR ? hasGRScore : hasGvGScores;

  if (!eventAwareHasScores && !baselineThinksHasScores) {
    return { skipped: true };
  }

  const playerEventData = preparePlayerEventData(player, currentEvent);

  const eventRef = doc(firestore, `topheroes/velaris/members/${player.id}/events/${eventId}`);
  const memberRef = doc(firestore, `topheroes/velaris/members/${player.id}`);
  const mainEventRef = doc(firestore, `topheroes/velaris/events/${eventId}`);

  const memberSnap = await getDoc(memberRef);
  const memberData = memberSnap.exists() ? memberSnap.data() : {};

  const eventChangeDate = currentEvent.endDate?.toDate ? currentEvent.endDate.toDate() : new Date();
  const memberUpdatedAt = memberData.updatedAt?.toDate ? memberData.updatedAt.toDate() : new Date(0);

  const changes = {};
  let performMemberUpdate = false;

  if (eventChangeDate > memberUpdatedAt) {
    const newPower = safeNumber(player.power);
    const newCastle = safeString(player.castle);
    const newRole = safeString(player.role);

    if (newPower !== null && newPower !== memberData.power) {
      const fromValue = memberData.power === undefined ? null : memberData.power;
      changes.power = { from: fromValue, to: newPower };
      performMemberUpdate = true;
    }
    if (newCastle !== null && newCastle !== memberData.castle) {
      const fromValue = memberData.castle === undefined ? null : memberData.castle;
      changes.castle = { from: fromValue, to: newCastle };
      performMemberUpdate = true;
    }
    if (newRole !== null && newRole !== memberData.role) {
      const fromValue = memberData.role === undefined ? null : memberData.role;
      changes.role = { from: fromValue, to: newRole };
      performMemberUpdate = true;
    }
  }

  const existingEventData = memberData.events?.[eventId] ?? {};

  const scoreFields = isGR
    ? ['score'] // GR single-score
    : ['scoreD1', 'scoreD2', 'scoreD3', 'scoreD4', 'scoreD5', 'scoreD6', 'overallScore']; // GvG

  const extraEventFields = ['rank', 'notes'];

  [...scoreFields, ...extraEventFields].forEach((field) => {
    const oldVal = existingEventData[field] === undefined ? null : existingEventData[field];
    const newVal = playerEventData[field] === undefined ? null : playerEventData[field];
    if (String(oldVal) !== String(newVal)) {
      changes[field] = { from: oldVal, to: newVal };
    }
  });

  const shouldSkipNoChange =
    Object.keys(changes).length === 0 &&
    !performMemberUpdate &&
    !!memberData.events?.[eventId];

  if (shouldSkipNoChange) {
    return { skipped: true, reason: 'no_changes' };
  }

  const nowISO = new Date().toISOString();

  // Sanitize the changes object deeply
  const cleanChanges = deepSanitize(changes);

  const historyEntry = {
    updatedBy: currentEvent.enteredBy || 'system',
    updatedAt: nowISO,
    changeNoted: eventChangeDate.toISOString(),
    changes: Object.keys(cleanChanges).length ? cleanChanges : { forceMigration: true }
  };

  // Sanitize the history entry itself
  const cleanHistoryEntry = deepSanitize(historyEntry);

  // Sanitize existing history array to prevent undefined values from previous entries
  const existingHistory = Array.isArray(memberData.history) ? deepSanitize(memberData.history) : [];
  const updatedHistory = [...existingHistory, cleanHistoryEntry];

  // Build memberUpdates object carefully, only including defined values
  const memberUpdates = {
    history: updatedHistory
  };

  if (performMemberUpdate) {
    const safePower = safeNumber(player.power);
    const safeCastle = safeString(player.castle);
    const safeRole = safeString(player.role);

    if (safePower !== null) memberUpdates.power = safePower;
    if (safeCastle !== null) memberUpdates.castle = safeCastle;
    if (safeRole !== null) memberUpdates.role = safeRole;

    memberUpdates.updatedBy = currentEvent.enteredBy || 'system';
    memberUpdates.updatedAt = nowISO;
    memberUpdates.changeDate = eventChangeDate.toISOString();
  }

  // Deep sanitize both objects before sending to Firestore
  const cleanPlayerEventData = deepSanitize(playerEventData);
  const cleanMemberUpdates = deepSanitize(memberUpdates);

  // Comprehensive validation to ensure no undefined values anywhere
  const validateNoUndefined = (obj, objName, path = '') => {
    if (obj === undefined) {
      throw new Error(`${objName} is undefined at path: ${path}`);
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        validateNoUndefined(item, objName, `${path}[${index}]`);
      });
    } else if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (value === undefined) {
          throw new Error(`Found undefined value in ${objName} at path: ${currentPath}`);
        }
        validateNoUndefined(value, objName, currentPath);
      });
    }
  };

  // Validate both objects have no undefined values
  try {
    validateNoUndefined(cleanPlayerEventData, 'cleanPlayerEventData');
    validateNoUndefined(cleanMemberUpdates, 'cleanMemberUpdates');
  } catch (validationError) {
    console.error('Validation failed:', validationError.message);
    console.error('Player data:', player);
    console.error('Original playerEventData:', playerEventData);
    console.error('Original memberUpdates:', memberUpdates);
    console.error('Cleaned playerEventData:', cleanPlayerEventData);
    console.error('Cleaned memberUpdates:', cleanMemberUpdates);
    throw new Error(`Data validation failed: ${validationError.message}`);
  }

  try {
    await Promise.all([
      setDoc(eventRef, cleanPlayerEventData),
      updateDoc(memberRef, cleanMemberUpdates),
      updateDoc(mainEventRef, {
        memberIds: arrayUnion(player.id),
        updatedAt: serverTimestamp()
      })
    ]);

    return { saved: true, data: cleanPlayerEventData };
  } catch (error) {
    console.error('Firestore save error:', error);
    console.error('Player data:', player);
    console.error('Clean player event data:', cleanPlayerEventData);
    console.error('Clean member updates:', cleanMemberUpdates);
    throw error;
  }
};