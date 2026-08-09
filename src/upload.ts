import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase.ts";
import type {Planet} from "./planet.ts";

export async function upload_planet(planet: Planet) {
    await addDoc(collection(db, "ug-planets"), planet)
}
