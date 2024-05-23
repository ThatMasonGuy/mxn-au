// functions/createUser.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createUser = functions.firestore.document('users/{userId}')
  .onCreate(async (snap, context) => {
    const newUser = snap.data();
    const { emailAddress, userName } = newUser;

    const usersRef = admin.firestore().collection('users');
    const emailQuery = usersRef.where('emailAddress', '==', emailAddress).limit(1);
    const userNameQuery = usersRef.where('userName', '==', userName).limit(1);

    const emailSnapshot = await emailQuery.get();
    const userNameSnapshot = await userNameQuery.get();

    if (!emailSnapshot.empty) {
      await snap.ref.delete(); // Delete the user document if email is not unique
      throw new functions.https.HttpsError('already-exists', 'Email address is already in use.');
    }

    if (!userNameSnapshot.empty) {
      await snap.ref.delete(); // Delete the user document if username is not unique
      throw new functions.https.HttpsError('already-exists', 'Username is already in use.');
    }

    // Optionally, you can perform additional operations here
    // For example, send a welcome email to the user
  });