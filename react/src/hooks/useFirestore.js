import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../Context/AuthProvider";

const useFirestore = (collectionData) => {
  const [documents, setDocuments] = useState([]);
  let {
    user: { uid },
  } = useContext(AuthContext);
  useEffect(() => {
    // let collectionRef = getDocs(collection(db, collectionData))

    // if (condition) {
    //   if (!condition.compareValue || !condition.compareValue.length) {
    //     // reset documents data
    //     setDocuments([]);
    //     return;
    //   }

    //   collectionRef = collectionRef.where(
    //     condition.fieldName,
    //     condition.operator,
    //     condition.compareValue
    //   );
    // }
    const unsubscribe = onSnapshot(collection(db, collectionData), (snapshot) =>{
        const documents = snapshot.docs.map(doc => ({
          ...doc.data(),
           id: doc.id
        }));
        documents.map((doc) => {
            if (doc.uid === uid) {
                setDocuments(doc);
            }
        });
        });
    return unsubscribe;
  }, [collectionData,uid]);

  return documents;
};

export default useFirestore;