package com.firebase;

import java.util.concurrent.ExecutionException;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;

import org.springframework.stereotype.Service;

@Service
public class CRUDService {
  
  public String createCRUD(CRUD crud) throws InterruptedException, ExecutionException {
    // Firestore db = FirestoreClient.getFirestore();
    // ApiFuture<WriteResult> collectionsApiFuture = db.collection("blockchain").document(crud.getName()).set(crud);
    // return collectionsApiFuture.get().getUpdateTime().toString();
    return "";
  }

  public CRUD getCRUD(String uid) throws InterruptedException, ExecutionException {
    Firestore db = FirestoreClient.getFirestore();
    DocumentReference documentReference = db.collection("users").document(uid);
    ApiFuture<DocumentSnapshot> future = documentReference.get();
    DocumentSnapshot document = future.get();
    CRUD crud;
    if (document.exists()) {
      crud = document.toObject(CRUD.class);
      return crud;
    }
    return null;
  }

  public String updateCRUD(CRUD crud) {
    return "";
  }

  public String deleteCRUD(String uid) {
    return "";
  }

}
