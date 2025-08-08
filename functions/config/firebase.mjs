import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp();
}

export const firebaseAdmin = admin;
export const db = admin.firestore();