package trung;
import java.util.ArrayList;
import com.google.gson.GsonBuilder;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.util.Timer;
import java.util.Date;
import java.util.TimerTask;

/* class test dung de chay thu chuong trinh
 * 
 */

public class test {

	public static ArrayList<Block> blockchain = new ArrayList<Block>();
	public static Wallet walletA;
	public static Wallet walletB;
	public static int difficulty = 4;
	public static int i=1;
	public static void main(String[] args) {
		
		blockchain.add(new Block("block"+String.valueOf(i), "0"));
		blockchain.get(i-1).mineBlock(difficulty);
		System.out.println("\nThe block chain: ");
		TimerTask timerTask = new TimerTask() {
            @Override /* chuong trinh thuc hien sau 1 khoang thoi gian*/
            public void run() {
            	i=i+1; 
            	String data;
            	data="block"+String.valueOf(i);
            	data=data+"\n"+"data moi";          	
            	Block Blocknow=new Block(data, blockchain.get(blockchain.size() - 1).hash);            	
            	blockchain.add(Blocknow);
            	blockchain.get(i-1).mineBlock(difficulty);
            	if(isChainValid().equals(true)) //kiem tra tinh toan ven
            	{
            		System.out.println("block true");
                }           	
            	String blockchainJson = new GsonBuilder().setPrettyPrinting().create().toJson(blockchain.get(i-1));
        		System.out.println(blockchainJson);
            }
        };
        long delay = 1000*60*2L; //delay 2 phut
        Timer timer = new Timer("Timer");
        timer.schedule(timerTask, 0, delay);
    }



	/* kiem tra tinh toan ven cua block
	 * 
	 */
	public static Boolean isChainValid() {
		Block currentBlock;
		Block previousBlock;

		for (int i = 1; i < blockchain.size(); i++) {
			currentBlock = blockchain.get(i);
			previousBlock = blockchain.get(i - 1);
			// compare registered hash and calculated hash:
			if (!currentBlock.hash.equals(currentBlock.calculateHash())) {
				System.out.println("Current Hashes not equal");
				return false;
			}
			// compare previous hash and registered previous hash
			if (!previousBlock.hash.equals(currentBlock.previousHash)) {
				System.out.println("Previous Hashes not equal");
				return false;
			}
		}
	
		return true;
	}

}



