package blockchain;
import java.util.ArrayList;
import java.util.Date;


public class Block {
	private String hash;
	private String previousHash;
	private String merkleRoot;
	private long timeStamp; // as number of milliseconds since 1/1/1970.
	private int nonce;
	private ArrayList<Transaction> transactions = new ArrayList<Transaction>(); //our data will be a simple message.
	public Object getHash;
	//public Object getTransactions;

	public String getHash() {
		return hash;
	}

	public void setHash(String hash) {
		this.hash = hash;
	}

	public String getPreviousHash() {
		return previousHash;
	}

	public void setPreviousHash(String previousHash) {
		this.previousHash = previousHash;
	}

	public String getMerkleRoot() {
		return merkleRoot;
	}

	public void setMerkleRoot(String merkleRoot) {
		this.merkleRoot = merkleRoot;
	}

	public ArrayList<Transaction> getTransactions() {
		return transactions;
	}

	public void setTransactions(ArrayList<Transaction> transactions) {
		this.transactions = transactions;
	}

	public long getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(long timeStamp) {
		this.timeStamp = timeStamp;
	}

	public int getNonce() {
		return nonce;
	}

	public void setNonce(int nonce) {
		this.nonce = nonce;
	}

	public Block(String previousHash) {
		this.previousHash = previousHash;
		this.timeStamp = new Date().getTime();
		this.hash = calculateHash(); // Making sure we do this after we set the other values.
		this.merkleRoot = merkleRoot;

	}

	public String calculateHash() {
		
		String calculatedhash = StringUtil.applySha256(previousHash + Long.toString(timeStamp)+ Integer.toString(nonce) + merkleRoot);
		return calculatedhash;
	}
	public void mineBlock(int difficulty) {
		String target = new String(new char[difficulty]).replace('\0', '0'); //Create a string with difficulty * "0" 
		while(!hash.substring( 0, difficulty).equals(target)) {
			nonce ++;
			hash = calculateHash();
		}
		System.out.println("Block Mined!!! : " + hash);
	}
	//Add transactions to this block
	public boolean addTransaction(Transaction transaction) {
			//process transaction and check if valid, unless block is genesis block then ignore.
			if(transaction == null) return false;		
			if((previousHash != "0")) {
				if((transaction.processTransaction() != true)) {
					System.out.println("Transaction failed to process. Discarded.");
					return false;
				}
			}
			transactions.add(transaction);
			System.out.println("Transaction Successfully added to Block");
			return true;
	}
}

