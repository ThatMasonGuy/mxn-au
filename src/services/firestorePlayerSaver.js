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

export const savePlayerToFirestore = async (player, currentEvent) => {
  if (!shouldSavePlayer(player)) return { skipped: true };

  const playerEventData = preparePlayerEventData(player, currentEvent);
  const eventId = currentEvent.id;

  const eventRef = doc(firestore, `topheroes/velaris/members/${player.id}/events/${eventId}`);
  const memberRef = doc(firestore, `topheroes/velaris/members/${player.id}`);
  const mainEventRef = doc(firestore, `topheroes/velaris/events/${eventId}`); // NEW

  const memberSnap = await getDoc(memberRef);
  const memberData = memberSnap.exists() ? memberSnap.data() : {};

  const eventChangeDate = currentEvent.endDate?.toDate ? currentEvent.endDate.toDate() : new Date();
  const memberUpdatedAt = memberData.updatedAt?.toDate ? memberData.updatedAt.toDate() : new Date(0);

  const changes = {};
  let performMemberUpdate = false;

  if (eventChangeDate > memberUpdatedAt) {
    if (Number(player.power) !== memberData.power) {
      changes.power = { from: memberData.power ?? null, to: Number(player.power) };
      performMemberUpdate = true;
    }
    if (player.castle !== memberData.castle) {
      changes.castle = { from: memberData.castle ?? null, to: player.castle };
      performMemberUpdate = true;
    }
    if (player.role !== memberData.role) {
      changes.role = { from: memberData.role ?? null, to: player.role };
      performMemberUpdate = true;
    }
  }

  const existingEventData = memberData.events?.[eventId] || {};
  const scoreFields = ['scoreD1', 'scoreD2', 'scoreD3', 'scoreD4', 'scoreD5', 'scoreD6', 'overallScore'];
  scoreFields.forEach((field) => {
    const oldVal = existingEventData[field] ?? null;
    const newVal = playerEventData[field];
    if (String(oldVal) !== String(newVal)) {
      changes[field] = { from: oldVal, to: newVal };
    }
  });

  const now = new Date().toISOString();
  const historyEntry = {
    updatedBy: currentEvent.enteredBy || 'system',
    updatedAt: now,
    changeNoted: eventChangeDate.toISOString(),
    changes: Object.keys(changes).length ? changes : { forceMigration: true }
  };

  const updatedHistory = [...(memberData.history || []), historyEntry];

  const memberUpdates = {
    history: updatedHistory,
    ...(performMemberUpdate && {
      power: Number(player.power),
      castle: Number(player.castle),
      role: player.role,
      updatedBy: currentEvent.enteredBy || 'system',
      updatedAt: now,
      changeDate: eventChangeDate.toISOString()
    })
  };

  const cleanPlayerEventData = Object.fromEntries(
    Object.entries(playerEventData).filter(([key, value]) => {
      if (value === undefined) {
        console.warn(`[SANITIZE] Field "${key}" is undefined for player ${player.id} in event ${currentEvent.id}`)
      }
      return value !== undefined
    })
  )
  
  await Promise.all([
    setDoc(eventRef, cleanPlayerEventData),
    updateDoc(memberRef, memberUpdates),
    updateDoc(mainEventRef, {
      memberIds: arrayUnion(player.id),
      updatedAt: serverTimestamp()
    })
  ]);

  return { saved: true, data: playerEventData };
};
