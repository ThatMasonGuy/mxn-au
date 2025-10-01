// src/firebase.js
import { initializeApp, setLogLevel } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
setLogLevel('warning');

let analytics = null;

if (typeof window !== 'undefined') {
  import('firebase/analytics')
    .then(async ({ getAnalytics, isSupported }) => {
      const analyticsSupported =
        typeof isSupported === 'function' ? await isSupported() : true;

      if (analyticsSupported) {
        analytics = getAnalytics(firebaseApp);
      }
    })
    .catch(() => {
      analytics = null;
    });
}

const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const realTimeDb = getDatabase(firebaseApp);
const functions = getFunctions(firebaseApp, 'australia-southeast1');

export { firestore, realTimeDb, analytics, functions, auth };