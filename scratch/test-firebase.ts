import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCAYeBk4ap09kTdRbYZrbIkIiQsiExMxek",
    authDomain: "orbitfinder.firebaseapp.com",
    projectId: "orbitfinder",
    storageBucket: "orbitfinder.firebasestorage.app",
    messagingSenderId: "314350384318",
    appId: "1:314350384318:web:d2e60049c2922cdce2daef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testUpload() {
    try {
        console.log("Attempting upload...");
        const docRef = await addDoc(collection(db, "ug-planets"), {
            name: "Test Planet",
            age: 1000,
            size: 1,
            terrain: 1,
            type: "terrestrial",
            colour: "#000000",
            water: 1,
            moons: 1,
            craters: 1,
            favoured: ["water"]
        });
        console.log("Upload success, ID:", docRef.id);
        process.exit(0);
    } catch (err) {
        console.error("Upload failed:", err);
        process.exit(1);
    }
}

testUpload();
