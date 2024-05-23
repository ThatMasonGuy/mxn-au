// src/firebase.js
import { initializeApp, setLogLevel } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBOI-UrNeKCWryN01GflbncbJDVZl2hrEE",
  authDomain: "maso-au.firebaseapp.com",
  databaseURL: "https://maso-au-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "maso-au",
  storageBucket: "maso-au.appspot.com",
  messagingSenderId: "888141867225",
  appId: "1:888141867225:web:8b9e99ec26456f034af6c8",
  measurementId: "G-18X1GQKWHY"
};

const firebaseApp = initializeApp(firebaseConfig);
setLogLevel('warning'); // Set the desired log level

const analytics = getAnalytics(firebaseApp);
const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const realTimeDb = getDatabase(firebaseApp);

export { firestore, auth, realTimeDb, analytics };