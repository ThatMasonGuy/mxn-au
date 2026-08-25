// @/shared/utils/useLogUserEvent.js
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { useMainStore } from "@/shared/stores/useMainStore";
import {
  sanitizeOperationalEventData,
  sanitizePathname,
} from "@/shared/analytics/analyticsPolicy";

// Deduplication cache to prevent rapid duplicate events
const eventCache = new Map();
const CACHE_DURATION = 4000; // 4 seconds

const getCacheKey = (uid, eventType, data) => {
  return `${uid}-${eventType}-${JSON.stringify(data)}`;
};

export const logUserEvent = async (eventType, data = {}) => {
  try {
    const mainStore = useMainStore();
    const user = mainStore.user;

    if (!user?.uid) {
      // Silently skip if no user
      return;
    }

    const sanitizedData = sanitizeOperationalEventData(eventType, data);

    // Check for duplicate events
    const cacheKey = getCacheKey(user.uid, eventType, sanitizedData);
    const cachedTime = eventCache.get(cacheKey);

    if (cachedTime && Date.now() - cachedTime < CACHE_DURATION) {
      console.log(`[logUserEvent] Skipping duplicate event: ${eventType}`);
      return;
    }

    // Mark this event as processed
    eventCache.set(cacheKey, Date.now());

    // Clean up old cache entries
    setTimeout(() => {
      eventCache.delete(cacheKey);
    }, CACHE_DURATION);

    const eventData = {
      type: eventType,
      timestamp: serverTimestamp(),
      data: {
        ...sanitizedData,
        userAgent: navigator.userAgent,
        path: sanitizePathname(window.location.pathname),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    };

    const eventRef = doc(
      collection(firestore, `users/${user.uid}/userEvents`),
    );

    // setDoc is safe to retry against the generated reference. addDoc uses a
    // create-only precondition, which can report "already exists" when a
    // network interruption makes Firestore retry a write that already landed.
    await setDoc(eventRef, eventData);
  } catch (err) {
    // More detailed error logging
    console.error("[logUserEvent] Failed to log:", {
      error: err,
      eventType,
      data,
      errorCode: err.code,
      errorMessage: err.message,
    });
    // Don't throw - logging is non-critical
  }
};

// Convenience methods with deduplication
export const logPageView = (page) => {
  return logUserEvent("page_view", { page });
};

export const logAction = (action, details = {}) => {
  return logUserEvent("action", { action, ...details });
};

export const logError = (error, context = {}) => {
  return logUserEvent("error", {
    name: error?.name || 'Error',
    area: context.area,
  });
};
