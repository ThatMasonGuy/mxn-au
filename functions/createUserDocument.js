// functions/createUserDocument.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createUserDocument = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const { firstName, lastName, userName, email, phoneNumber, dateOfBirth } = data;

  const userDoc = admin.firestore().collection('users').doc(context.auth.uid);
  const userDocSnapshot = await userDoc.get();

  if (userDocSnapshot.exists) {
    throw new functions.https.HttpsError('already-exists', 'User document already exists.');
  }

  await userDoc.set({
    firstName,
    lastName,
    userName,
    emailAddress: email,
    phoneNumber,
    dateOfBirth,
    avatarUrl: '',
  });

  return { success: true };
});