package com.blockchain.trung;

import java.util.ArrayList;

import com.blockchain.Wallet;
import com.google.gson.GsonBuilder;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.util.Timer;
import java.util.Date;
import java.util.TimerTask;

/* class test dung de chay thu chuong trinh
 * 
 */

public class test_chuc_nang_toan_ven {

	public static ArrayList<Block> blockchain = new ArrayList<Block>();
	public static Wallet walletA;
	public static Wallet walletB;
	public static int difficulty = 4;
	public static int i=1;
	public static void main(String[] args) {
		//Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
		//walletA = new Wallet();
		//walletB = new Wallet();
		
		blockchain.add(new Block("block 1","00000000000000000"));
		blockchain.get(i-1).mineBlock(difficulty);
		String blockchaini = new GsonBuilder().setPrettyPrinting().create().toJson(blockchain.get(i-1));
    	System.out.println(blockchaini);
		
		
		i=i+1; 
    	String data;
    	data="block"+String.valueOf(i);
    	data=data+"";          	
    	Block Blocknow2=new Block(data, blockchain.get(blockchain.size() - 1).hash);  
    	blockchain.add(Blocknow2);
    	blockchain.get(i-1).mineBlock(difficulty);
    	if(isChainValid().equals(true)) //kiem tra tinh toan ven
    	{
    		System.out.println("block true");
        }    
    	blockchaini = new GsonBuilder().setPrettyPrinting().create().toJson(blockchain.get(i-1));
    	System.out.println(blockchaini);
    	
    	i=i+1; 
    	data="block"+String.valueOf(i);
    	data=data+"";          	
    	Block Blocknow3=new Block(data, blockchain.get(blockchain.size() - 1).hash);  
    	blockchain.add(Blocknow3);
    	blockchain.get(i-1).mineBlock(difficulty);
    	if(isChainValid().equals(true)) //kiem tra tinh toan ven
    	{
    		System.out.println("block true");
        }   
    	blockchaini = new GsonBuilder().setPrettyPrinting().create().toJson(blockchain.get(i-1));
    	System.out.println(blockchaini);
    	
    	i=i+1; 
    	data="block"+String.valueOf(i);
    	data=data+"";          	
    	Block Blocknow4=new Block(data, blockchain.get(blockchain.size() - 1).hash);  
    	blockchain.add(Blocknow4);
    	blockchain.get(i-1).mineBlock(difficulty);
    	if(isChainValid().equals(true)) //kiem tra tinh toan ven
    	{
    		System.out.println("block true");
        }           

    	String blockchainJson = new GsonBuilder().setPrettyPrinting().create().toJson(blockchain.get(i-1));
		System.out.println(blockchainJson);
		
		// sua data de hack
    	blockchain.set(2, new Block("data da bi sua ",blockchain.get(blockchain.size() - 3).hash));
    	//blockchaini = new GsonBuilder().setPrettyPrinting().create().toJson(blockchain.get(2));
    	//System.out.println(blockchaini);
		
    	//
    	i=i+1; 
    	data="block"+String.valueOf(i);
    	data=data+"";          	
    	Block Blocknow5=new Block(data, blockchain.get(blockchain.size() - 1).hash);  
    	blockchain.add(Blocknow5);
    	blockchain.get(i-1).mineBlock(difficulty);
    	if(isChainValid().equals(true)) //kiem tra tinh toan ven
    	{
    		System.out.println("block true");
        }   
    	blockchaini = new GsonBuilder().setPrettyPrinting().create().toJson(blockchain.get(i-1));
    	System.out.println(blockchaini);
    	i=i+1; 
    	data="block"+String.valueOf(i);
    	data=data+"";          	
    	Block Blocknow6=new Block(data, blockchain.get(blockchain.size() - 1).hash);  
    	blockchain.add(Blocknow6);
    	blockchain.get(i-1).mineBlock(difficulty);
    	if(isChainValid().equals(true)) //kiem tra tinh toan ven
    	{
    		System.out.println("block true");
        }   
    	blockchaini = new GsonBuilder().setPrettyPrinting().create().toJson(blockchain.get(i-1));
    	System.out.println(blockchaini);
    	
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
			// so sanh hash block hien tai voi block duoc tinh ra 
			if (!currentBlock.hash.equals(currentBlock.calculateHash())) {
				System.out.println("Current Hashes not equal, error block "+i);
				return false;
			}
			// so sanh hash block truoc voi block hien tai
			if (!previousBlock.hash.equals(currentBlock.previousHash)) {
				System.out.println("Previous Hashes not equal, error block "+ i);
				return false;
			}
		}
	
		return true;
	}

}



