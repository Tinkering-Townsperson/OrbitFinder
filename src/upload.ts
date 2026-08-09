import { addDoc, setDoc, doc, collection } from "firebase/firestore";
import { db } from "./firebase";
import type {Planet} from "./planet";

export async function upload_planet(planet: Planet, existingId?: string) {
    if (existingId) {
        console.log(planet);
        const docRef = doc(db, "ug-planets", existingId);
        await setDoc(docRef, planet);
        return existingId;
    } else {
        const docRef = await addDoc(collection(db, "ug-planets"), planet);
        return docRef.id;
    }
}
