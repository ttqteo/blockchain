package com.blockchain;

import java.io.IOException;
import java.security.Security;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import com.google.gson.Gson;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class CRUDService {
	public static ArrayList<Block> blockchain = new ArrayList<Block>();
	public static HashMap<String,TransactionOutput> UTXOs = new HashMap<String,TransactionOutput>(); //list of all unspent transactions. 
  static { Security.addProvider(new BouncyCastleProvider()); }
	public static Transaction genesisTransaction;
	public static float minimumTransaction = 0.1f;
  public static int difficulty = 3;

  public static void addBlock(Block newBlock) {
		newBlock.mineBlock(difficulty);
		blockchain.add(newBlock);
	}

  public String signupCRUD(String uid) throws InterruptedException, ExecutionException {
    Firestore db = FirestoreClient.getFirestore();
    DocumentReference docRef = db.collection("users").document(uid);
    ApiFuture<DocumentSnapshot> future = docRef.get();
    DocumentSnapshot document = future.get();
    if (document.exists()) {
      Wallet wallet = new Wallet();
		  Wallet coinbase = new Wallet();
      //create genesis transaction, which sends 100 NoobCoin to walletA: 
      genesisTransaction = new Transaction(coinbase.getPublicKey(), wallet.getPublicKey(), 100f, null);
      genesisTransaction.generateSignature(coinbase.getPrivateKey());	 //manually sign the genesis transaction	
      genesisTransaction.setTransactionId("0"); //manually set the transaction id
      genesisTransaction.getOutputs().add(new TransactionOutput(genesisTransaction.getReciepient(), genesisTransaction.getValue(), genesisTransaction.getTransactionId())); //manually add the Transactions Output
      UTXOs.put(genesisTransaction.getOutputs().get(0).getId(), genesisTransaction.getOutputs().get(0)); //its important to store our first transaction in the UTXOs list.
      
      //new block
      Block genesis = new Block("0");
      genesis.addTransaction(genesisTransaction);
      addBlock(genesis);

      System.out.println("balance:" + wallet.getBalance());

      Map<String, Object> walletObj = new HashMap<>();
      walletObj.put("publicKey", wallet.getPublicKey().toString());
      walletObj.put("privateKey", wallet.getPrivateKey().toString());
      walletObj.put("UTXOs", wallet.getUTXOs().toString());
      ApiFuture<WriteResult> writeActivity = docRef.update("wallet", walletObj);
      return writeActivity.get().getUpdateTime().toString();
    }
    return null;
  }

  public String buyCRUD(String uid, double value) throws InterruptedException, ExecutionException, JSONException {
    Firestore db = FirestoreClient.getFirestore();
    DocumentReference docRef = db.collection("users").document(uid);
    ApiFuture<DocumentSnapshot> future = docRef.get();
    DocumentSnapshot document = future.get();
    CRUD crud;
    if (document.exists()) {
      //get asset to handle
      crud = document.toObject(CRUD.class);
      Object asset = crud.getAsset();
      String string = asset.toString();
      string = string.replace(", ", "\",\"").replace("{", "{\"").replace("\"{", "{").replace("}", "\"}").replace("}\"", "}").replace("=", "\":\"");

      //handle buy to asset
      JSONArray jsonArr = new JSONArray(string);
      String valueOld = jsonArr.getJSONObject(5).getString("quantity");
      jsonArr.getJSONObject(5).put("quantity", Double.parseDouble(valueOld) + value);
      ArrayList<Object> array = new ArrayList<>();
      for(int i = 0; i < jsonArr.length(); i++) 
        Collections.addAll(array, jsonArr.getJSONObject(i).toMap());
      ApiFuture<WriteResult> writeAsset = docRef.update("asset", array);

      //write activity
      Date date = new Date();
      Timestamp ts = new Timestamp(date.getTime());
      Map<String, Object> activity = new HashMap<>();
      activity.put("type", "buy");
      activity.put("wallet", "");
      activity.put("token1", "");
      activity.put("token2", "");
      activity.put("value", value);
      activity.put("time", ts);
      ApiFuture<WriteResult> writeActivity = docRef.update("activity", FieldValue.arrayUnion(activity));

      return writeActivity.get().getUpdateTime().toString();
    }
    return null;
  }

  public String sendCRUD(String uid1, String uid2, String token, double value) throws InterruptedException, ExecutionException, JSONException {
    Firestore db = FirestoreClient.getFirestore();
    //from user
    DocumentReference docRef1 = db.collection("users").document(uid1);
    ApiFuture<DocumentSnapshot> future1 = docRef1.get();
    DocumentSnapshot document1 = future1.get();
    //to user
    DocumentReference docRef2 = db.collection("users").document(uid2);
    ApiFuture<DocumentSnapshot> future2 = docRef2.get();
    DocumentSnapshot document2 = future2.get();
    
    CRUD crud1;
    CRUD crud2;
    if (document2.exists()) {
      if (document1.exists()) {
        //generate
        String[] tokenList = {"ETH", "BNB", "BTC", "ADA", "SOL", "USD"};
        int index = 0;
        for(int i = 0; i < 6; i++)
          if (token.equals(tokenList[i])) {
            index = i;
            break;
          }
        Date date = new Date();
        Timestamp ts = new Timestamp(date.getTime());
  
        //from user
        //get asset to handle
        crud1 = document1.toObject(CRUD.class);
        Object asset1 = crud1.getAsset();
        String string1 = asset1.toString();
        string1 = string1.replace(", ", "\",\"").replace("{", "{\"").replace("\"{", "{").replace("}", "\"}").replace("}\"", "}").replace("=", "\":\"");
  
        //handle send to asset 
        JSONArray jsonArr1 = new JSONArray(string1);
        String valueOld1 = jsonArr1.getJSONObject(index).getString("quantity");
        jsonArr1.getJSONObject(index).put("quantity", Double.parseDouble(valueOld1) - value);
        ArrayList<Object> array = new ArrayList<>();
        for(int i = 0; i < jsonArr1.length(); i++) 
          Collections.addAll(array, jsonArr1.getJSONObject(i).toMap());
        ApiFuture<WriteResult> writeAsset1 = docRef1.update("asset", array);
  
        //write activity
        Map<String, Object> activity1 = new HashMap<>();
        activity1.put("type", "send");
        activity1.put("wallet", uid2);
        activity1.put("token1", token);
        activity1.put("token2", "");
        activity1.put("value", value);
        activity1.put("time", ts);
        ApiFuture<WriteResult> writeActivity1 = docRef1.update("activity", FieldValue.arrayUnion(activity1));
  
        //to user
        //get asset to handle
        crud2 = document2.toObject(CRUD.class);
        Object asset2 = crud2.getAsset();
        String string2 = asset2.toString();
        string2 = string2.replace(", ", "\",\"").replace("{", "{\"").replace("\"{", "{").replace("}", "\"}").replace("}\"", "}").replace("=", "\":\"");
  
        //handle send to asset 
        JSONArray jsonArr2 = new JSONArray(string2);
        String valueOld = jsonArr2.getJSONObject(index).getString("quantity");
        jsonArr2.getJSONObject(index).put("quantity", Double.parseDouble(valueOld) + value);
        ArrayList<Object> array2 = new ArrayList<>();
        for(int i = 0; i < jsonArr2.length(); i++) 
          Collections.addAll(array2, jsonArr2.getJSONObject(i).toMap());
        ApiFuture<WriteResult> writeAsset2 = docRef2.update("asset", array2);
  
        //write activity
        Map<String, Object> activity2 = new HashMap<>();
        activity2.put("type", "receivce");
        activity2.put("wallet", uid1);
        activity2.put("token1", token);
        activity2.put("token2", "");
        activity2.put("value", value);
        activity2.put("time", ts);
        ApiFuture<WriteResult> writeActivity2 = docRef2.update("activity", FieldValue.arrayUnion(activity2));
  
        return writeActivity1.get().getUpdateTime().toString();
      }
    }
    return null;
  }

  public String swapCRUD(String uid, String token1, double value, String token2) throws InterruptedException, ExecutionException, JSONException, NumberFormatException, IOException {
    Firestore db = FirestoreClient.getFirestore();
    DocumentReference docRef = db.collection("users").document(uid);
    ApiFuture<DocumentSnapshot> future = docRef.get();
    DocumentSnapshot document = future.get();
    CRUD crud;
    if (document.exists()) {
      //generate
      String[] tokenList = {"ETH", "BNB", "BTC", "ADA", "SOL", "USD"};
      int index1 = 0, index2 = 0;
      for(int i = 0; i < 6; i++) {
        if (token1.equals(tokenList[i])) index1 = i;
        if (token2.equals(tokenList[i])) index2 = i;
      }
      System.out.println("index1: " + index1);
      System.out.println("index2: " + index2);
      Date date = new Date();
      Timestamp ts = new Timestamp(date.getTime());

      crud = document.toObject(CRUD.class);
      Object asset = crud.getAsset();
      String string = asset.toString();
      string = string.replace(", ", "\",\"").replace("{", "{\"").replace("\"{", "{").replace("}", "\"}").replace("}\"", "}").replace("=", "\":\"");

      //handle swap to asset
      JSONArray jsonArr = new JSONArray(string);
      String valueOld1 = jsonArr.getJSONObject(index1).getString("quantity");
      jsonArr.getJSONObject(index1).put("quantity", Double.parseDouble(valueOld1) - value);
      Double swapValue = CurrencyConverter.CurrencyConverter(token1, token2, Double.parseDouble(valueOld1));
      String valueOld2 = jsonArr.getJSONObject(index2).getString("quantity");
      jsonArr.getJSONObject(index2).put("quantity", Double.parseDouble(valueOld2) + swapValue);

      ArrayList<Object> array = new ArrayList<>();
      for(int i = 0; i < jsonArr.length(); i++) 
        Collections.addAll(array, jsonArr.getJSONObject(i).toMap());
      ApiFuture<WriteResult> writeAsset = docRef.update("asset", array);

      //write activity
      Map<String, Object> activity = new HashMap<>();
      activity.put("type", "swap");
      activity.put("wallet", "");
      activity.put("token1", token1);
      activity.put("token2", token2);
      activity.put("value", value);
      activity.put("time", ts);
      ApiFuture<WriteResult> writeActivity = docRef.update("activity", FieldValue.arrayUnion(activity));

      return writeActivity.get().getUpdateTime().toString();
    }
    return null;
  }

}
