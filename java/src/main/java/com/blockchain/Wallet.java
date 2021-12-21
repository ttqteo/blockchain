package com.blockchain;

import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class Wallet {
	private PrivateKey privateKey;
	private PublicKey publicKey;
	private HashMap<String,TransactionOutput> UTXOs = new HashMap<String,TransactionOutput>(); //only UTXOs owned by this wallet.

	public PrivateKey getPrivateKey() {
		return privateKey;
	}

	public void setPrivateKey(PrivateKey privateKey) {
		this.privateKey = privateKey;
	}

	public PublicKey getPublicKey() {
		return publicKey;
	}

	public void setPublicKey(PublicKey publicKey) {
		this.publicKey = publicKey;
	}

	public HashMap<String, TransactionOutput> getUTXOs() {
		return UTXOs;
	}

	public void setUTXOs(HashMap<String, TransactionOutput> uTXOs) {
		UTXOs = uTXOs;
	}

	public Wallet() {
		generateKeyPair();
	}

	public void generateKeyPair() {
		try {
			KeyPairGenerator keyGen = KeyPairGenerator.getInstance("ECDSA", "BC");
			SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
			ECGenParameterSpec ecSpec = new ECGenParameterSpec("prime192v1");
			// Initialize the key generator and generate a KeyPair
			keyGen.initialize(ecSpec, random); // 256 bytes provides an
												// acceptable security level
			KeyPair keyPair = keyGen.generateKeyPair();
			// Set the public and private keys from the keyPair
			privateKey = keyPair.getPrivate();
			publicKey = keyPair.getPublic();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	// returns balance and stores the UTXO's owned by this wallet in this.UTXOs
	public float getBalance() {
			float total = 0;
			for (Map.Entry<String, TransactionOutput> item : blockchain.UTXOs.entrySet()) {
				TransactionOutput UTXO = item.getValue();
				if (UTXO.isMine(publicKey)) { // if output belongs to me ( if coins
												// belong to me )
					UTXOs.put(UTXO.getId(), UTXO); // add it to our list of unspent
												// transactions.
					total += UTXO.getValue();
				}
			}
			return total;
	}

	// Generates and returns a new transaction from this wallet.
	public Transaction sendFunds(PublicKey _recipient, float value) {
			if (getBalance() < value) { // gather balance and check funds.
				System.out.println("#Not Enough funds to send transaction. Transaction Discarded.");
				return null;
			}
			// create array list of inputs
			ArrayList<TransactionInput> inputs = new ArrayList<TransactionInput>();

			float total = 0;
			for (Map.Entry<String, TransactionOutput> item : UTXOs.entrySet()) {
				TransactionOutput UTXO = item.getValue();
				total += UTXO.getValue();
				inputs.add(new TransactionInput(UTXO.getId()));
				if (total > value)
					break;
			}

			Transaction newTransaction = new Transaction(publicKey, _recipient, value, inputs);
			newTransaction.generateSignature(privateKey);

			for (TransactionInput input : inputs) {
				UTXOs.remove(input.getTransactionOutputId());
			}
			return newTransaction;
	}
}
