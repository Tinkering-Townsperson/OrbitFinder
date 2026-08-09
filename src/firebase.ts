// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAYeBk4ap09kTdRbYZrbIkIiQsiExMxek",
    authDomain: "orbitfinder.firebaseapp.com",
    projectId: "orbitfinder",
    storageBucket: "orbitfinder.firebasestorage.app",
    messagingSenderId: "314350384318",
    appId: "1:314350384318:web:d2e60049c2922cdce2daef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
