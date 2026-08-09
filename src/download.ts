import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    QueryDocumentSnapshot,
    type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Planet } from "./planet";

const PAGE_SIZE = 10;

export async function fetchFirstPage() {
    const q = query(
        collection(db, "ug-planets"),
        orderBy("name"),      // you must orderBy something for cursors to work
        limit(PAGE_SIZE)
    );
    const snapshot = await getDocs(q);

    const planets = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Planet) }));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1]; // cursor for next page

    return { planets, lastDoc };
}

export async function fetchNextPage(lastDoc: QueryDocumentSnapshot<DocumentData>) {
    const q = query(
        collection(db, "ug-planets"),
        orderBy("name"),
        startAfter(lastDoc),   // start right after the last doc we saw
        limit(PAGE_SIZE)
    );
    const snapshot = await getDocs(q);

    const planets = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Planet) }));
    const lastDocNew = snapshot.docs[snapshot.docs.length - 1];

    return { planets, lastDoc: lastDocNew };
}

export async function fetchAllPlanets(): Promise<Planet[]> {
    const colRef = collection(db, "ug-planets"); // "planets" = your collection name
    const snapshot = await getDocs(colRef);

    return snapshot.docs.map((doc) => ({
        ...(doc.data() as Planet),
    }));
}
