import { getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

export const firebaseApp = getApps()[0] ?? initializeApp();
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

// Keep the small legacy surface used throughout the existing Functions code
// while sourcing every service from Firebase Admin's supported modular API.
// This lets the application move to Admin SDK 14 without a risky all-at-once
// rewrite of otherwise stable report and utility functions.
const firestore = Object.assign(() => db, { FieldValue });

export const firebaseAdmin = {
    apps: getApps(),
    app: () => firebaseApp,
    initializeApp,
    firestore,
    auth: () => auth,
    storage: () => getStorage(firebaseApp),
};
