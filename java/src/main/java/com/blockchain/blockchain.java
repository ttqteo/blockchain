package com.blockchain;
import java.security.Security;
import java.util.ArrayList;
import com.google.gson.GsonBuilder;
import java.util.HashMap;


public class blockchain {
	public static ArrayList<Block> blockchain = new ArrayList<Block>();
	public static int difficulty = 3;
	public static float minimumTransaction = 0.1f;
	public static Wallet walletA;
	public static Wallet walletB;
	public static Wallet walletC;

	public static Transaction genesisTransaction;
	public static Transaction genesisTransaction1;
	
	// public static void main(String[] args) {	
	// 	//add our blocks to the blockchain ArrayList:
	// 	Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider()); //Setup Bouncey castle as a Security Provider
	// 	CRUDService.UTXOs = new HashMap<String,TransactionOutput>();
	// 	//Create wallets:
	// 	Wallet walletA = new Wallet();
	// 	walletC = new Wallet();	
		
	// 	Wallet coinbase = new Wallet();
		
	// 	//create genesis transaction, which sends 100 NoobCoin to walletA: 
	// 	genesisTransaction = new Transaction(coinbase.getPublicKey(), walletA.getPublicKey(), 100f, null);
	// 	genesisTransaction.generateSignature(coinbase.getPrivateKey());	 //manually sign the genesis transaction	
	// 	genesisTransaction.setTransactionId("0"); //manually set the transaction id
	// 	genesisTransaction.getOutputs().add(new TransactionOutput(genesisTransaction.getReciepient(), genesisTransaction.getValue(), genesisTransaction.getTransactionId())); //manually add the Transactions Output
	// 	CRUDService.UTXOs.put(genesisTransaction.getOutputs().get(0).getId(), genesisTransaction.getOutputs().get(0)); //its important to store our first transaction in the UTXOs list.
	// 	System.out.println("genesisTransaction.getOutputs().get(0).getId(): " + genesisTransaction.getOutputs().get(0).getId());
	// 	System.out.println("\nWalletA's balance is: " + walletA.getBalance());

	// 	String utxoA = new GsonBuilder().setPrettyPrinting().create().toJson(walletA.getUTXOs());
	// 	System.out.println("\nUTXO A: \n" + utxoA);

	// 	System.out.println("Creating and Mining Genesis block... ");
	// 	Block genesis = new Block("0");
	// 	genesis.addTransaction(genesisTransaction);
	// 	addBlock(genesis);

	// 	//add 100f
	// 	Wallet coinbase2 = new Wallet();

	// 	genesisTransaction = new Transaction(coinbase2.getPublicKey(), walletA.getPublicKey(), 100f, null);
	// 	genesisTransaction.generateSignature(coinbase.getPrivateKey());	 //manually sign the genesis transaction	
	// 	genesisTransaction.setTransactionId("0"); //manually set the transaction id
	// 	genesisTransaction.getOutputs().add(new TransactionOutput(genesisTransaction.getReciepient(), genesisTransaction.getValue(), genesisTransaction.getTransactionId())); //manually add the Transactions Output
	// 	CRUDService.UTXOs.put(genesisTransaction.getOutputs().get(0).getId(), genesisTransaction.getOutputs().get(0)); //its important to store our first transaction in the UTXOs list.
	// 	System.out.println("genesisTransaction.getOutputs().get(0).getId(): " + genesisTransaction.getOutputs().get(0).getId());
	// 	String utxos = new GsonBuilder().setPrettyPrinting().create().toJson(CRUDService.UTXOs);
	// 	System.out.println("\nUTXOs: " + utxos);
	// 	System.out.println("\nWalletA's balance is: " + walletA.getBalance());

	// 	String utxoAA = new GsonBuilder().setPrettyPrinting().create().toJson(walletA.getUTXOs());
	// 	System.out.println("\nUTXO A 1: \n" + utxoAA);

	// 	System.out.println("Creating and Mining Genesis block... ");
	// 	Block block1 = new Block(genesis.getHash());
	// 	block1.addTransaction(genesisTransaction);
	// 	addBlock(block1);


		
		//Check block0
		// String blockchainJson0 = new GsonBuilder().setPrettyPrinting().create().toJson(genesis);
		// System.out.println("\nThe block chain 0: ");
		//System.out.println(blockchainJson0);

		// Wallet walletB = new Wallet();
		// genesisTransaction = new Transaction(coinbase.getPublicKey(), walletB.getPublicKey(), 100f, null);
		// genesisTransaction.generateSignature(coinbase.getPrivateKey());	 //manually sign the genesis transaction	
		// genesisTransaction.setTransactionId("0"); //manually set the transaction id
		// genesisTransaction.getOutputs().add(new TransactionOutput(genesisTransaction.getReciepient(), genesisTransaction.getValue(), genesisTransaction.getTransactionId())); //manually add the Transactions Output
		// CRUDService.UTXOs.put(genesisTransaction.getOutputs().get(0).getId(), genesisTransaction.getOutputs().get(0)); //its important to store our first transaction in the UTXOs list.
		// System.out.println("\nWalletB's balance is: " + walletB.getBalance());

		// String utxoB = new GsonBuilder().setPrettyPrinting().create().toJson(walletB.getUTXOs());
		// System.out.println("\nUTXO B: \n" + utxoB);
		
		
		// //testing
		// // Block block1 = new Block(genesis.getHash());
		// blockchain.get(0).addTransaction(genesisTransaction);
		// // addBlock(block1);
		// // System.out.println("\nWalletA's balance is: " + walletA.getBalance());
		// // System.out.println("\nWalletA is Attempting to send funds (40) to WalletB...");
		// // block1.addTransaction(walletA.sendFunds(walletB.getPublicKey(), 40f));
		
		// // Check block0
		// // String blockchainJson = new GsonBuilder().setPrettyPrinting().create().toJson(blockchain.get(0));
		// System.out.println("\nThe block chain 0: ");
		// // System.out.println(blockchainJson);

		// Block block1 = new Block(genesis.getHash());
		// addBlock(block1);
		// System.out.println("\nWalletA's balance is: " + walletA.getBalance());
		// System.out.println("\nWalletA is Attempting to send funds (40) to WalletB...");
		// block1.addTransaction(walletA.sendFunds(walletB.getPublicKey(), 40f));
		// walletA.getBalance();
		// walletB.getBalance();


		// // String blockchainJson1 = new GsonBuilder().setPrettyPrinting().create().toJson(block1);
		// System.out.println("\nThe block chain 1: ");
		// // System.out.println(blockchainJson1);

		// String utxos = new GsonBuilder().setPrettyPrinting().create().toJson(CRUDService.UTXOs);
		// System.out.println("\nUTXOs: " + utxos);

		// String utxoAA = new GsonBuilder().setPrettyPrinting().create().toJson(walletA.getUTXOs());
		// System.out.println("\nUTXO A: \n" + utxoAA);
		// String utxoBB = new GsonBuilder().setPrettyPrinting().create().toJson(walletB.getUTXOs());
		// System.out.println("\nUTXO B: \n" + utxoBB);

		// Block block2 = new Block(block1.getHash());
		// addBlock(block2);
		// System.out.println("\nWalletA's balance is: " + walletA.getBalance());
		// System.out.println("\nWalletA is Attempting to send funds (40) to WalletB...");
		// block2.addTransaction(walletA.sendFunds(walletB.getPublicKey(), 40f));
		// walletA.getBalance();
		// walletB.getBalance();

		// // String blockchainJson2 = new GsonBuilder().setPrettyPrinting().create().toJson(block2);
		// System.out.println("\nThe block chain 2: ");
		// // System.out.println(blockchainJson2);

		// String utxoss = new GsonBuilder().setPrettyPrinting().create().toJson(CRUDService.UTXOs);
		// System.out.println("\nUTXOs: " + utxoss);

		// String utxoAAA = new GsonBuilder().setPrettyPrinting().create().toJson(walletA.getUTXOs());
		// System.out.println("\nUTXO A: \n" + utxoAAA);
		// String utxoBBB = new GsonBuilder().setPrettyPrinting().create().toJson(walletB.getUTXOs());
		// System.out.println("\nUTXO B: \n" + utxoBBB);
		
		// // addBlock(block1);
		// System.out.println("\nWalletA's balance is: " + walletA.getBalance());
		// System.out.println("WalletB's balance is: " + walletB.getBalance());
		
		// //Check over quantity 
		// Block block2 = new Block(block1.getHash());
		// System.out.println("\nWalletA Attempting to send more funds (1000) than it has...");
		// block2.addTransaction(walletA.sendFunds(walletB.getPublicKey(), 1000f));
		// addBlock(block2);
		// System.out.println("\nWalletA's balance is: " + walletA.getBalance());
		// System.out.println("WalletB's balance is: " + walletB.getBalance());
		
		
		
		// Block block3 = new Block(block2.getHash());
		// System.out.println("\nWalletB is Attempting to send funds (20) to WalletA...");
		// block3.addTransaction(walletB.sendFunds( walletA.getPublicKey(), 20));
		// System.out.println("\nWalletA's balance is: " + walletA.getBalance());
		// System.out.println("WalletB's balance is: " + walletB.getBalance());

		
	// 	isChainValid();
		
		
	// }

	public static Boolean isChainValid() {
		Block currentBlock;
		Block previousBlock;
		String hashTarget = new String(new char[difficulty]).replace('\0', '0');
		HashMap<String,TransactionOutput> tempUTXOs = new HashMap<String,TransactionOutput>(); //a temporary working list of unspent transactions at a given block state.
		tempUTXOs.put(genesisTransaction.getOutputs().get(0).getId(), genesisTransaction.getOutputs().get(0));
		
		
		for (int i = 1; i < blockchain.size(); i++) {
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
				if (currentTransaction.getInputs() != null) {

					if(currentTransaction.getInputsValue() != currentTransaction.getOutputsValue()) {
						System.out.println("#Inputs are note equal to outputs on Transaction(" + t + ")");
						return false; 
					}
					
					for(TransactionInput input: currentTransaction.getInputs()) {	
						tempOutput = tempUTXOs.get(input.getTransactionOutputId());
						
						if(tempOutput == null || t != 0) {
							System.out.println("#Referenced input on Transaction(" + t + ") is Missing");
							return false;
						}
						
						if(input.getUTXO().getValue() != tempOutput.getValue()) {
							System.out.println("#Referenced input Transaction(" + t + ") value is Invalid");
							return false;
						}
						
						tempUTXOs.remove(input.getTransactionOutputId());
					}
					
					for(TransactionOutput output: currentTransaction.getOutputs()) {
						tempUTXOs.put(output.getId(), output);
					}
					
					if( currentTransaction.getOutputs().get(0).getReciepient() != currentTransaction.getReciepient()) {
						System.out.println("#Transaction(" + t + ") output reciepient is not who it should be");
						return false;
					}
					if( currentTransaction.getOutputs().get(1).getReciepient() != currentTransaction.getSender()) {
						System.out.println("#Transaction(" + t + ") output 'change' is not sender.");
						return false;
					}
				}
				
			}
		}
		System.out.println("Blockchain is valid");
		return true;
	}
	public static void addBlock(Block newBlock) {
		newBlock.mineBlock(difficulty);
		blockchain.add(newBlock);
	}

	
}
