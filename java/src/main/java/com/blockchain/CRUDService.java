package com.blockchain;

import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Security;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import com.google.gson.GsonBuilder;
import com.blockchain.Transaction;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class CRUDService {
  public static ArrayList<Block> blockchain;
  public static HashMap<String,TransactionOutput> UTXOs; //list of all unspent transactions. 
  public static Transaction genesisTransaction;
	public static float minimumTransaction = 0.1f;
  public static int difficulty = 3;
  static Wallet coinbase;

  public void updateCoinbase() {
    Firestore db = FirestoreClient.getFirestore();
    //get coinbase infinity wallet
    coinbase.getBalance();
    Map<String, Object> coinbaseObj = new HashMap<>();
    coinbaseObj.put("publicKey", Base64.getEncoder().encodeToString(coinbase.getPublicKey().getEncoded()));
    coinbaseObj.put("privateKey", Base64.getEncoder().encodeToString(coinbase.getPrivateKey().getEncoded()));
    // String utxo = new GsonBuilder().setPrettyPrinting().create().toJson(coinbase.getUTXOs());
    // System.out.println("\nWallet UTXO: \n" + utxo);
    Map<String, Object> walletUTXO = new HashMap<>();
    for (Map.Entry<String, TransactionOutput> item : UTXOs.entrySet()) {
      TransactionOutput UTXO = item.getValue();
      if (UTXO.isMine(coinbase.getPublicKey())) { 
        String id = UTXO.getId();
        Map<String, Object> outputObj = new HashMap<>();
        outputObj.put("id", coinbase.getUTXOs().get(id).getId());
        outputObj.put("value", coinbase.getUTXOs().get(id).getValue());
        outputObj.put("reciepient", Base64.getEncoder().encodeToString(coinbase.getPublicKey().getEncoded()));
        outputObj.put("parentTransactionId", coinbase.getUTXOs().get(id).getParentTransactionId());
        walletUTXO.put(id, outputObj);
      }
    }
    coinbaseObj.put("UTXOs", walletUTXO);
    //set coinbase wallet to API
    ApiFuture<WriteResult> writeWallet = db.collection("blockchains").document("Others").update("wallet", coinbaseObj);
  }

  public static void addBlock(Block newBlock) throws InterruptedException, ExecutionException {
    Firestore db = FirestoreClient.getFirestore();
		newBlock.mineBlock(difficulty);
		blockchain.add(newBlock);

    //push to firebase
    Map<String, Object> blockData = new HashMap<>();
    blockData.put("hash",newBlock.getHash());
    blockData.put("previousHash",newBlock.getPreviousHash());
    blockData.put("nonce",newBlock.getNonce());
    blockData.put("timeStamp",newBlock.getTimeStamp());

    //transactions
    ArrayList<Object> transactionArray = new ArrayList<>();

    for (int i = 0; i < newBlock.getTransactions().size(); i++) {
      Map<String, Object> transactionObj = new HashMap<>();
      transactionObj.put("transactionId", newBlock.getTransactions().get(i).getTransactionId());
      transactionObj.put("value", newBlock.getTransactions().get(i).getValue());
      transactionObj.put("sender", Base64.getEncoder().encodeToString(newBlock.getTransactions().get(i).getSender().getEncoded()));
      transactionObj.put("reciepient", Base64.getEncoder().encodeToString(newBlock.getTransactions().get(i).getReciepient().getEncoded()));
      transactionObj.put("signature", Base64.getEncoder().encodeToString(newBlock.getTransactions().get(i).getSignature()));
  
      //inputs
      if (newBlock.getTransactions().get(i).getInputs() != null) {
        ArrayList<Object> input = new ArrayList<>();
        for (int j = 0; j < newBlock.getTransactions().get(i).getInputs().size() ;j++) {
          Map<String, Object> inputObj = new HashMap<>();
          ArrayList<TransactionInput> inputs = newBlock.getTransactions().get(i).getInputs();
          inputObj.put("transactionOutputId", inputs.get(j).getTransactionOutputId());
          Collections.addAll(input, inputObj);
        }
        transactionObj.put("inputs", input);
      }
      //outputs
      ArrayList<Object> output = new ArrayList<>();
      for (int j = 0; j < newBlock.getTransactions().get(i).getOutputs().size(); j++) {
        Map<String, Object> outputObj = new HashMap<>();
        ArrayList<TransactionOutput> outputs = newBlock.getTransactions().get(i).getOutputs();
        outputObj.put("id", outputs.get(j).getId());
        outputObj.put("value", outputs.get(j).getValue());
        outputObj.put("reciepient", Base64.getEncoder().encodeToString(outputs.get(j).getReciepient().getEncoded()));
        outputObj.put("parentTransactionId", outputs.get(j).getParentTransactionId());
        Collections.addAll(output, outputObj);
      }
      transactionObj.put("outputs", output);
      Collections.addAll(transactionArray, transactionObj);

    }

    blockData.put("transactions",transactionArray);

    ApiFuture<WriteResult> writeBlock = db.collection("blockchains").document("Block" + (blockchain.size()-1)).set(blockData);

    //increase total
    DocumentReference docRefTotal = db.collection("blockchains").document("Others");
    ApiFuture<WriteResult> futureTotal = docRefTotal.update("total", blockchain.size());
    System.out.println("Blockchain Size after add block: " + blockchain.size());
    
	}
  
  public void getBlockchain() throws InterruptedException, ExecutionException, NoSuchAlgorithmException, NoSuchProviderException, InvalidKeySpecException {
    Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
    KeyFactory keyFactory = KeyFactory.getInstance("ECDSA", "BC");
    blockchain = new ArrayList<Block>();
    UTXOs = new HashMap<String,TransactionOutput>();
    coinbase = new Wallet();
    Firestore db = FirestoreClient.getFirestore();
    DocumentReference documentReference = db.collection("blockchains").document("Others");
    ApiFuture<DocumentSnapshot> future = documentReference.get();
    DocumentSnapshot document = future.get();
    if (document.exists() && document.get("total") != null) {
      //get coinbase wallet
      coinbase = getStringWallet(document.get("wallet").toString());
      //get all blockchain
      int total = Integer.parseInt(document.get("total").toString());
      for (int i = 0; i < total; i++) {
        DocumentReference docRefBlockchain = db.collection("blockchains").document("Block"+i);
        ApiFuture<DocumentSnapshot> futureBlockchain = docRefBlockchain.get();
        DocumentSnapshot documentBlockchain = futureBlockchain.get();
        Block block = new Block();
        block.setHash(documentBlockchain.get("hash").toString());
        block.setNonce(Integer.parseInt(documentBlockchain.get("nonce").toString()));
        block.setPreviousHash(documentBlockchain.get("previousHash").toString());
        block.setTimeStamp(Long.parseLong(documentBlockchain.get("timeStamp").toString()));
        //transactions
        //generate
        ArrayList<Transaction> transactionsArray = new ArrayList<Transaction>();
        Transaction transactions = new Transaction();
        String transString = documentBlockchain.get("transactions").toString();
        // System.out.println(transString);
        String[] parts = transString.split("}]");
        // for (int j = 0; j < parts.length; j++) {
        //   System.out.println("part " + j + ": " + parts[j]);
        // }
        String transactionId = new String();
        String valueTrans = new String();
        String reciepientTrans = new String();
        String senderTrans = new String();
        String signatureTrans = new String();
        if (transString.contains("inputs")) {
          //part[1] part[2]
          //check part[1]
          String[] partInput = parts[1].split("inputs=");
          String[] partItem1 = partInput[0].split(",");
          for (int j = 0; j < partItem1.length; j++) {
            if (partItem1[j].contains("transactionId")) transactionId = partItem1[j].substring(15, partItem1[j].length()).trim();
            if (partItem1[j].contains("value")) valueTrans = partItem1[j].substring(7, partItem1[j].length()).trim();
            if (partItem1[j].contains("reciepient")) reciepientTrans = partItem1[j].substring(12, partItem1[j].length()).trim();
            if (partItem1[j].contains("sender")) senderTrans = partItem1[j].substring(8, partItem1[j].length()).trim();
            if (partItem1[j].contains("signature")) signatureTrans = partItem1[j].substring(11, partItem1[j].length()).trim();
          }
          String inputsArr = partInput[1] + "}]";
          inputsArr = inputsArr.replace(", ", "\",\"").replace("{", "{\"").replace("\"{", "{").replace("}", "\"}").replace("}\"", "}").replace("=", "\":\"");
          JSONArray inputArray = new JSONArray(inputsArr);
          ArrayList<TransactionInput> inputs = new ArrayList<TransactionInput>();
          TransactionInput inputItem = new TransactionInput();
          for (int j = 0; j < inputArray.length(); j++) {
            inputItem.setTransactionOutputId(inputArray.getJSONObject(j).getString("transactionOutputId"));
            inputs.add(inputItem);
          }
          transactions.setInputs(inputs);
          //check part[2]
          String[] partItem2 = parts[2].split(",");
          for (int j = 0; j < partItem2.length; j++) {
            if (partItem2[j].contains("transactionId")) transactionId = partItem2[j].substring(15, partItem2[j].length()).trim();
            if (partItem2[j].contains("value")) valueTrans = partItem2[j].substring(7, partItem2[j].length()).trim();
            if (partItem2[j].contains("reciepient")) reciepientTrans = partItem2[j].substring(12, partItem2[j].length()).trim();
            if (partItem2[j].contains("sender")) senderTrans = partItem2[j].substring(8, partItem2[j].length()).trim();
            if (partItem2[j].contains("signature")) signatureTrans = partItem2[j].substring(11, partItem2[j].length()).trim();
          }
        } else {
          //parts[1]
          String[] partItem = parts[1].split(",");
          for (int j = 0; j < partItem.length; j++) {
            if (partItem[j].contains("transactionId")) transactionId = partItem[j].substring(15, partItem[j].length()).trim();
            if (partItem[j].contains("value")) valueTrans = partItem[j].substring(7, partItem[j].length()).trim();
            if (partItem[j].contains("reciepient")) reciepientTrans = partItem[j].substring(12, partItem[j].length()).trim();
            if (partItem[j].contains("sender")) senderTrans = partItem[j].substring(8, partItem[j].length()).trim();
            if (partItem[j].contains("signature")) signatureTrans = partItem[j].substring(11, partItem[j].length()).trim();
          }
        }
        
        //get rest of item
        PublicKey reciepientTransKey = keyFactory.generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(reciepientTrans)));
        transactions.setReciepient(reciepientTransKey);
        PublicKey senderTransKey = keyFactory.generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(senderTrans)));
        transactions.setSender(senderTransKey);

        transactions.setSignature(Base64.getDecoder().decode(signatureTrans));
        transactions.setValue(Float.parseFloat(valueTrans));
        transactions.setTransactionId(transactionId);

        //parts[0]
        //get array outputs
        String outputArr = parts[0].split("outputs=")[1] + "}]";
        outputArr = outputArr.replace(", ", "\",\"").replace("{", "{\"").replace("\"{", "{").replace("}", "\"}").replace("}\"", "}").replace("=", "\":\"");
        JSONArray outputArray = new JSONArray(outputArr);
        //outputs
        ArrayList<TransactionOutput> outputs = new ArrayList<TransactionOutput>();
        TransactionOutput outputItem = new TransactionOutput();
        for (int j = 0; j < outputArray.length(); j++) {
          outputItem.setId(outputArray.getJSONObject(j).getString("id"));
          outputItem.setValue(Float.parseFloat(outputArray.getJSONObject(j).getString("value")));
          String reciepient = outputArray.getJSONObject(j).getString("reciepient");
          PublicKey reciepientKey = keyFactory.generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(reciepient)));
          outputItem.setReciepient(reciepientKey);
          outputItem.setParentTransactionId(outputArray.getJSONObject(j).getString("parentTransactionId"));
          outputs.add(outputItem);
        }
        transactions.setOutputs(outputs);
        transactionsArray.add(transactions);
        block.setTransactions(transactionsArray);
        blockchain.add(block);
      }
    } else {
      //initalize
      Wallet baseBlock = new Wallet();
      genesisTransaction = new Transaction(baseBlock.getPublicKey(), coinbase.getPublicKey(), Integer.MAX_VALUE, null);
      genesisTransaction.generateSignature(baseBlock.getPrivateKey());	 //manually sign the genesis transaction	
      genesisTransaction.setTransactionId("0"); //manually set the transaction id
      genesisTransaction.getOutputs().add(new TransactionOutput(genesisTransaction.getReciepient(), genesisTransaction.getValue(), genesisTransaction.getTransactionId())); //manually add the Transactions Output
      UTXOs.put(genesisTransaction.getOutputs().get(0).getId(), genesisTransaction.getOutputs().get(0)); //its important to store our first transaction in the UTXOs list.
      updateCoinbase();
      //add first-block
      Map<String, Object> docData = new HashMap<>();
      docData.put("total", 1);
      ApiFuture<WriteResult> futureTotal = db.collection("blockchains").document("Others").set(docData);
      Block genesis = new Block("0");
      genesis.addTransaction(genesisTransaction);
      addBlock(genesis);
      //set total
    }

    System.out.println("Blockchain size from API: " + blockchain.size());
  }

  public Map<String, Object> updateUserWalletAPI(Wallet wallet) {
    Map<String, Object> walletObj = new HashMap<>();
    walletObj.put("publicKey", Base64.getEncoder().encodeToString(wallet.getPublicKey().getEncoded()));
    walletObj.put("privateKey", Base64.getEncoder().encodeToString(wallet.getPrivateKey().getEncoded()));
    //UTXOs each Wallet
    String utxo = new GsonBuilder().setPrettyPrinting().create().toJson(wallet.getUTXOs());
    System.out.println("\nWallet UTXO: \n" + utxo);
    Map<String, Object> walletUTXO = new HashMap<>();
    for (Map.Entry<String, TransactionOutput> item : UTXOs.entrySet()) {
      TransactionOutput UTXO = item.getValue();
      if (UTXO.isMine(wallet.getPublicKey())) { 
        String id = UTXO.getId();
        Map<String, Object> outputObj = new HashMap<>();
        outputObj.put("id", wallet.getUTXOs().get(id).getId());
        outputObj.put("value", wallet.getUTXOs().get(id).getValue());
        outputObj.put("reciepient", Base64.getEncoder().encodeToString(wallet.getPublicKey().getEncoded()));
        outputObj.put("parentTransactionId", wallet.getUTXOs().get(id).getParentTransactionId());
        walletUTXO.put(id, outputObj);
      }
    }
    walletObj.put("UTXOs", walletUTXO);
    return walletObj;
  }

  public Map<String, Object> addValueToWallet (Wallet wallet, float value) throws InterruptedException, ExecutionException, InvalidKeySpecException, NoSuchAlgorithmException, NoSuchProviderException {
    Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider()); //Setup Bouncey castle as a Security Provider
    //add block
    Block block = new Block(blockchain.get(blockchain.size()-1).getHash());
    if (!block.addTransaction(coinbase.sendFunds(wallet.getPublicKey(), value))) 
      return null;
    addBlock(block);
    coinbase.getBalance();
    updateCoinbase();
    //update wallet each user
    System.out.println("\nWallet's balance after buy/create +" + value + " ETH is: " + wallet.getBalance());
    return updateUserWalletAPI(wallet);
  }

  public static Wallet getStringWallet(String string) throws InvalidKeySpecException, NoSuchAlgorithmException, NoSuchProviderException {
    Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
    String[] walletArrPublic = string.split("publicKey=");
    String publicKeystr = walletArrPublic[1].substring(0, walletArrPublic[1].length() - 1);
    String[] walletArrUTXO = walletArrPublic[0].split("UTXOs=");
    String[] wallet1ArrPrivate = walletArrUTXO[0].split("privateKey=");
    String privateKeystr = wallet1ArrPrivate[1].substring(0, wallet1ArrPrivate[1].length() - 2);

    KeyFactory keyFactory = KeyFactory.getInstance("ECDSA", "BC");
    PublicKey publicKey = keyFactory.generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(publicKeystr)));
    PrivateKey privateKey = keyFactory.generatePrivate(new PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKeystr)));

    String UTXOstemp = walletArrUTXO[1].substring(1, walletArrUTXO[1].length() - 3);
    String[] UTXOsItem = UTXOstemp.split("id");
    HashMap<String,TransactionOutput> UTXOwallet = new HashMap<String,TransactionOutput>();
    for (int i = 1; i < UTXOsItem.length; i++) {
      String UTXOs = "{id" + UTXOstemp.split("id")[i];
      UTXOs = UTXOs.replace(", ", "\",\"").replace("{", "{\"").replace("\"{", "{").replace("}", "\"}").replace("}\"", "}").replace("=", "\":\"");
      JSONObject UTXO = new JSONObject(UTXOs);
      TransactionOutput output = new TransactionOutput();
      output.setId(UTXO.getString("id"));
      output.setValue(Float.parseFloat(UTXO.getString("value")));
      output.setReciepient(publicKey);
      output.setParentTransactionId(UTXO.getString("parentTransactionId"));        
      UTXOwallet.put(UTXO.getString("id"), output);
    }
    //utxo
    Wallet wallet = new Wallet();
    wallet.setUTXOs(UTXOwallet);
    wallet.setPublicKey(publicKey);
    wallet.setPrivateKey(privateKey);
    return wallet;
  }

  public static void getUTXOsAPI() throws InterruptedException, ExecutionException, InvalidKeySpecException, NoSuchAlgorithmException, NoSuchProviderException {
    Firestore db = FirestoreClient.getFirestore();
    for (Map.Entry<String, TransactionOutput> item : coinbase.getUTXOs().entrySet()) {
      TransactionOutput UTXO = item.getValue();
      UTXOs.put(UTXO.getId(), UTXO); // add it to our list of unspent
    }
    //wallet user
    ApiFuture<QuerySnapshot> future = db.collection("users").get();
    List<QueryDocumentSnapshot> documents = future.get().getDocuments();
    for (QueryDocumentSnapshot document : documents) {
      CRUD crud = document.toObject(CRUD.class);
      if (crud.getWallet() != null) {
        Wallet wallet = getStringWallet(crud.getWallet().toString());
        for (Map.Entry<String, TransactionOutput> item : wallet.getUTXOs().entrySet()) {
          TransactionOutput UTXO = item.getValue();
          if (UTXO.isMine(wallet.getPublicKey())) { 
            UTXOs.put(UTXO.getId(), UTXO); // add it to our list of unspent
          }
        }
      }
    }
    // String UTXOstring = new GsonBuilder().setPrettyPrinting().create().toJson(UTXOs);
    // System.out.println("Total UTXOs: \n" + UTXOstring);
  }

  public static Map<String, Object> activity(String type, String wallet, String token1, String token2, float value1, float value2) {
    Date date = new Date();
    Timestamp ts = new Timestamp(date.getTime());
    Map<String, Object> item = new HashMap<>();
    item.put("type", type);
    item.put("wallet", wallet);
    item.put("token1", token1);
    item.put("token2", token2);
    item.put("value1", value1);
    if (value2 == 0)
      item.put("value2", "");
    else
      item.put("value2", value2);
    item.put("time", ts);
    return item;
  }


  //routing
  public String signinCRUD() throws InterruptedException, ExecutionException, NoSuchAlgorithmException, NoSuchProviderException, InvalidKeySpecException {
    //get blockchain in API
    getBlockchain();
    getUTXOsAPI();
    isChainValid();
    return "Total: " + blockchain.size() + " Block";
  }

  public String signupCRUD(String uid) throws InterruptedException, ExecutionException, NoSuchAlgorithmException, NoSuchProviderException, InvalidKeySpecException {
    getBlockchain();
    getUTXOsAPI();
    Firestore db = FirestoreClient.getFirestore();
    DocumentReference docRef = db.collection("users").document(uid);
    ApiFuture<DocumentSnapshot> future = docRef.get();
    DocumentSnapshot document = future.get();
    if (document.exists()) {
      Wallet wallet = new Wallet();
      ApiFuture<WriteResult> writeWallet = docRef.update("wallet", addValueToWallet(wallet, 100f));
      return writeWallet.get().getUpdateTime().toString();
    }
    isChainValid();
    return "Error to sign-up";
  }

  public String buyCRUD(String uid, float value) throws InterruptedException, ExecutionException, JSONException, InvalidKeySpecException, NoSuchAlgorithmException, NoSuchProviderException {
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
      jsonArr.getJSONObject(5).put("quantity", Float.parseFloat(valueOld) + value);
      ArrayList<Object> array = new ArrayList<>();
      for(int i = 0; i < jsonArr.length(); i++) 
        Collections.addAll(array, jsonArr.getJSONObject(i).toMap());
      ApiFuture<WriteResult> writeAsset = docRef.update("asset", array);

      //write activity
      ApiFuture<WriteResult> writeActivity = docRef.update("activity", FieldValue.arrayUnion(activity("buy", "", "", "", value, 0)));
      Wallet wallet = getStringWallet(crud.getWallet().toString());
      ApiFuture<WriteResult> writeWallet = docRef.update("wallet", addValueToWallet(wallet, value));
      isChainValid();
      return writeActivity.get().getUpdateTime().toString();
    }
    return null;
  }

  public String sendCRUD(String uid1, String uid2, String token, float value) throws InterruptedException, ExecutionException, JSONException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchProviderException, IOException {
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
        crud1 = document1.toObject(CRUD.class);
        crud2 = document2.toObject(CRUD.class);

        //exchange to ETH
        Float valueETH = 0f;
        if (!token.equals("ETH"))
          valueETH = CurrencyConverter.CurrencyConverter(token, "ETH", value);

        //add block
        Block block = new Block(blockchain.get(blockchain.size()-1).getHash());
        Wallet wallet1 = getStringWallet(crud1.getWallet().toString());
        System.out.println("Before transaction: ");
		    System.out.println("- Wallet 1's balance is: " + wallet1.getBalance());
        Wallet wallet2 = getStringWallet(crud2.getWallet().toString());
		    System.out.println("- Wallet 2's balance is: " + wallet2.getBalance());
        if (!block.addTransaction(wallet1.sendFunds(wallet2.getPublicKey(), valueETH))) 
          return "Can't not make transaction";
        addBlock(block);
        System.out.println("After transaction:");
		    System.out.println("- Wallet 1's balance is: " + wallet1.getBalance());
        ApiFuture<WriteResult> writeWallet1 = docRef1.update("wallet", updateUserWalletAPI(wallet1));
		    System.out.println("- Wallet 2's balance is: " + wallet2.getBalance());
        ApiFuture<WriteResult> writeWallet2 = docRef2.update("wallet", updateUserWalletAPI(wallet2));


        //from user
        //get asset to handle
        Object asset1 = crud1.getAsset();
        String string1 = asset1.toString();
        string1 = string1.replace(", ", "\",\"").replace("{", "{\"").replace("\"{", "{").replace("}", "\"}").replace("}\"", "}").replace("=", "\":\"");
  
        //handle send to asset 
        JSONArray jsonArr1 = new JSONArray(string1);
        String valueOld1 = jsonArr1.getJSONObject(index).getString("quantity");
        jsonArr1.getJSONObject(index).put("quantity", Float.parseFloat(valueOld1) - value);
        ArrayList<Object> array = new ArrayList<>();
        for(int i = 0; i < jsonArr1.length(); i++) 
          Collections.addAll(array, jsonArr1.getJSONObject(i).toMap());
        ApiFuture<WriteResult> writeAsset1 = docRef1.update("asset", array);
  
        //write activity
        ApiFuture<WriteResult> writeActivity1 = docRef1.update("activity", FieldValue.arrayUnion(activity("send", uid2, token, "", value, 0)));
  
        //to user
        //get asset to handle
        Object asset2 = crud2.getAsset();
        String string2 = asset2.toString();
        string2 = string2.replace(", ", "\",\"").replace("{", "{\"").replace("\"{", "{").replace("}", "\"}").replace("}\"", "}").replace("=", "\":\"");
  
        //handle send to asset 
        JSONArray jsonArr2 = new JSONArray(string2);
        String valueOld = jsonArr2.getJSONObject(index).getString("quantity");
        jsonArr2.getJSONObject(index).put("quantity", Float.parseFloat(valueOld) + value);
        ArrayList<Object> array2 = new ArrayList<>();
        for(int i = 0; i < jsonArr2.length(); i++) 
          Collections.addAll(array2, jsonArr2.getJSONObject(i).toMap());
        ApiFuture<WriteResult> writeAsset2 = docRef2.update("asset", array2);
  
        //write activity
        ApiFuture<WriteResult> writeActivity2 = docRef2.update("activity", FieldValue.arrayUnion(activity("receivce", uid1, token, "", value, 0)));
        isChainValid();
        return writeActivity1.get().getUpdateTime().toString();
      }
    }
    return null;
  }

  public String swapCRUD(String uid, String token1, float value, String token2) throws InterruptedException, ExecutionException, JSONException, NumberFormatException, IOException {
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
      Date date = new Date();
      Timestamp ts = new Timestamp(date.getTime());

      crud = document.toObject(CRUD.class);
      Object asset = crud.getAsset();
      String string = asset.toString();
      string = string.replace(", ", "\",\"").replace("{", "{\"").replace("\"{", "{").replace("}", "\"}").replace("}\"", "}").replace("=", "\":\"");

      //handle swap to asset
      JSONArray jsonArr = new JSONArray(string);
      String valueOld1 = jsonArr.getJSONObject(index1).getString("quantity");
      jsonArr.getJSONObject(index1).put("quantity", Float.parseFloat(valueOld1) - value);
      Float swapValue = CurrencyConverter.CurrencyConverter(token1, token2, Float.parseFloat(valueOld1));
      String valueOld2 = jsonArr.getJSONObject(index2).getString("quantity");
      jsonArr.getJSONObject(index2).put("quantity", Float.parseFloat(valueOld2) + swapValue);

      ArrayList<Object> array = new ArrayList<>();
      for(int i = 0; i < jsonArr.length(); i++) 
        Collections.addAll(array, jsonArr.getJSONObject(i).toMap());
      ApiFuture<WriteResult> writeAsset = docRef.update("asset", array);

      //write activity
      ApiFuture<WriteResult> writeActivity = docRef.update("activity", FieldValue.arrayUnion(activity("swap", "", token1, token2, value, swapValue)));
      isChainValid();
      return writeActivity.get().getUpdateTime().toString();
    }
    return null;
  }

  public static Boolean isChainValid() {
		Block currentBlock;
		Block previousBlock;
		String hashTarget = new String(new char[difficulty]).replace('\0', '0');
		HashMap<String,TransactionOutput> tempUTXOs = new HashMap<String,TransactionOutput>(); //a temporary working list of unspent transactions at a given block state.
    genesisTransaction = blockchain.get(0).getTransactions().get(0);
		tempUTXOs.put(genesisTransaction.getOutputs().get(0).getId(), genesisTransaction.getOutputs().get(0));
		
		for (int i = 1; i < blockchain.size(); i++) {
      System.out.println("Checking current blockchain " + i);
			currentBlock = blockchain.get(i);
			previousBlock = blockchain.get(i - 1);
			// compare registered hash and calculated hash:
			if (!currentBlock.getHash().equals(currentBlock.calculateHash())) {
				System.out.println("Current Hashes not equal");
				return false;
			}
			// compare previous hash and registered previous hash
			if (!previousBlock.getHash().equals(currentBlock.getPreviousHash())) {
				System.out.println("Previous Hashes not equal");
				return false;
			}
			//check if hash is solved
			if(!currentBlock.getHash().substring( 0, difficulty).equals(hashTarget)) {
				System.out.println("This block hasn't been mined");
				return false;
			}
			//loop thru blockchains transactions:
			TransactionOutput tempOutput;
			for(int t=0; t <currentBlock.getTransactions().size(); t++) {
				Transaction currentTransaction = currentBlock.getTransactions().get(t);

				if(!currentTransaction.verifiySignature()) {
					System.out.println("#Signature on Transaction(" + t + ") is Invalid");
					return false; 
				}
        // if(currentTransaction.getInputsValue() != currentTransaction.getOutputsValue()) {
        //   System.out.println("#Inputs are note equal to outputs on Transaction(" + t + ")");
        //   return false; 
        // }
        
        for(TransactionInput input: currentTransaction.getInputs()) {	
          tempOutput = tempUTXOs.get(input.getTransactionOutputId());
          
          if(tempOutput == null || t != 0) {
            System.out.println("#Referenced input on Transaction(" + t + ") is Missing");
            return false;
          }
          
          // if(input.getUTXO().getValue() != tempOutput.getValue()) {
          //   System.out.println("#Referenced input Transaction(" + t + ") value is Invalid");
          //   return false;
          // }
          
          tempUTXOs.remove(input.getTransactionOutputId());
        }
        
        for(TransactionOutput output: currentTransaction.getOutputs()) {
          tempUTXOs.put(output.getId(), output);
        }
        // if( !currentTransaction.getOutputs().get(0).getReciepient().equals(currentTransaction.getReciepient()) ) {
        //   System.out.println("#Transaction(" + t + ") output reciepient is not who it should be");
        //   return false;
        // }
        if( !currentTransaction.getOutputs().get(1).getReciepient().equals(currentTransaction.getSender())) {
          System.out.println("#Transaction(" + t + ") output 'change' is not sender.");
          return false;
        }
				
				
			}
		}
		System.out.println("Blockchain is valid");
		return true;
	}
}
