const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const createUser = require('./createUser');
const createUserDocument = require('./createUserDocument');

exports.createUser = createUser.createUser;
exports.createUserDocument = createUserDocument.createUserDocument;