import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBkJC1Wjar2OjWfj5ynQWXOu2gkPBhXprI",
    authDomain: "nafmaily.firebaseapp.com",
    projectId: "nafmaily",
    storageBucket: "nafmaily.firebasestorage.app",
    messagingSenderId: "514437348436",
    appId: "1:514437348436:web:ff6d82f655445a4206c1c1",
    measurementId: "G-M4GBHL7SP3"
};

// Initialize Firebase (prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firestore instance
export const db = getFirestore(app);

// Storage instance
export const storage = getStorage(app);

export default app;
