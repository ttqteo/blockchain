import { db } from "./config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const addDocument = (collectionName, data) => {
  addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
};
