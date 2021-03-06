package com.blockchain;

import java.security.*;
import java.util.ArrayList;

public class Transaction {

	private String transactionId; // this is also the hash of the transaction.
	private PublicKey sender; // senders address/public key.
	private PublicKey reciepient; // Recipients address/public key.
	private float value;
	private byte[] signature; // this is to prevent anybody else from spending
							// funds in our wallet.

  private ArrayList<TransactionInput> inputs = new ArrayList<TransactionInput>();
	private ArrayList<TransactionOutput> outputs = new ArrayList<TransactionOutput>();

	private static int sequence = 0; // a rough count of how many transactions
										// have been generated.

	// Constructor:
	public Transaction() {

	}

	public Transaction(PublicKey from, PublicKey to, float value, ArrayList<TransactionInput> inputs) {
		this.sender = from;
		this.reciepient = to;
		this.value = value;
		this.inputs = inputs;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public PublicKey getSender() {
		return sender;
	}

	public void setSender(PublicKey sender) {
		this.sender = sender;
	}

	public PublicKey getReciepient() {
		return reciepient;
	}

	public void setReciepient(PublicKey reciepient) {
		this.reciepient = reciepient;
	}

	public float getValue() {
		return value;
	}

	public void setValue(float value) {
		this.value = value;
	}

	public byte[] getSignature() {
		return signature;
	}

	public void setSignature(byte[] signature) {
		this.signature = signature;
	}

	public ArrayList<TransactionInput> getInputs() {
		return inputs;
	}

	public void setInputs(ArrayList<TransactionInput> inputs) {
		this.inputs = inputs;
	}

	public ArrayList<TransactionOutput> getOutputs() {
		return outputs;
	}

	public void setOutputs(ArrayList<TransactionOutput> outputs) {
		this.outputs = outputs;
	}

	public static int getSequence() {
		return sequence;
	}

	public static void setSequence(int sequence) {
		Transaction.sequence = sequence;
	}

	// This Calculates the transaction hash (which will be used as its Id)
	private String calulateHash() {
		sequence++; // increase the sequence to avoid 2 identical transactions
					// having the same hash
		return StringUtil.applySha256(StringUtil.getStringFromKey(sender) + StringUtil.getStringFromKey(reciepient)
				+ Float.toString(value) + sequence);
	}
	// Signs all the data we dont wish to be tampered with.
	public void generateSignature(PrivateKey privateKey) {
		String data = StringUtil.getStringFromKey(sender) + StringUtil.getStringFromKey(reciepient) + Float.toString(value);
		signature = StringUtil.applyECDSASig(privateKey, data);
	}

		// Verifies the data we signed hasnt been tampered with
	public boolean verifiySignature() {
		String data = StringUtil.getStringFromKey(sender) + StringUtil.getStringFromKey(reciepient) + Float.toString(value);
		return StringUtil.verifyECDSASig(sender, data, signature);
	}
	
	// Returns true if new transaction could be created.
	public boolean processTransaction() {

			if (verifiySignature() == false) {
				System.out.println("#Transaction Signature failed to verify");
				return false;
			}

			if (inputs == null) 
				return true;

			// gather transaction inputs (Make sure they are unspent):
			for (TransactionInput i : inputs) {
				i.setUTXO(CRUDService.UTXOs.get(i.getTransactionOutputId()));
			}

			// check if transaction is valid:
			if (getInputsValue() < CRUDService.minimumTransaction) {
				System.out.println("#Transaction Inputs to small: " + getInputsValue());
				return false;
			}

			// generate transaction outputs:
			float leftOver = getInputsValue() - value; // get value of inputs then the left over change:
			transactionId = calulateHash();
			outputs.add(new TransactionOutput(this.reciepient, value, transactionId)); // send value to recipient
			outputs.add(new TransactionOutput(this.sender, leftOver, transactionId)); // send the left over 'change' back to sender

			// add outputs to Unspent list
			for (TransactionOutput o : outputs) {
				CRUDService.UTXOs.put(o.getId(), o);
			}

			// remove transaction inputs from UTXO lists as spent:
			for (TransactionInput i : inputs) {
				if (i.getUTXO() == null)
					continue; // if Transaction can't be found skip it
				CRUDService.UTXOs.remove(i.getUTXO().getId());
			}

			return true;
		}

	// returns sum of inputs(UTXOs) values
	public float getInputsValue() {
			float total = 0;
			for (TransactionInput i : inputs) {
				if (i.getUTXO() == null)
					continue; // if Transaction can't be found skip it
				total += i.getUTXO().getValue();
			}
			return total;
		}

	// returns sum of outputs:
	public float getOutputsValue() {
			float total = 0;
			for (TransactionOutput o : outputs) {
				total += o.getValue();
			}
			return total;
		}
	
}
