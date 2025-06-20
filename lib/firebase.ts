import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAIqmbmuZ4tsedAqlEd3Xi-u2gaZvEQxnU",
  authDomain: "goodday-records.firebaseapp.com",
  projectId: "goodday-records",
  storageBucket: "goodday-records.firebasestorage.app",
  messagingSenderId: "216124466634",
  appId: "1:216124466634:web:e8b7c5005867c0fefa9b33",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db }; 