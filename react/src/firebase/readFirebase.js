import React from 'react';
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";


export async function readfirebase(uid) {
    let arrs = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      arrs = [...arrs, doc.data()];
    });
    console.log(arrs,"readfirebase")
}

