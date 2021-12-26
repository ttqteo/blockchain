
package com.blockchain ;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Scanner;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import org.json.JSONException;


public class CurrencyConverter{
	
	public static float CurrencyConverter(String fromCode, String toCode, float amount) throws IOException, JSONException {
		HashMap<Integer,String> currencyCodes = new HashMap<Integer,String>();
		
		//Code currency
		currencyCodes.put(1, "BTC");
		currencyCodes.put(2, "ETH");
		currencyCodes.put(3, "USD");
		currencyCodes.put(4, "BNB");
		currencyCodes.put(5, "ADA");
		currencyCodes.put(6, "SOL");
		
		return sendHttpGETRequest(fromCode,toCode, amount);
		
	}
	private static float sendHttpGETRequest(String fromCode, String toCode, float amount) throws IOException, JSONException {
		DecimalFormat deci = new DecimalFormat("00.0000");
		//https://api.fastforex.io/convert?from=USD&to=CAD&amount=1&api_key=a542c21ba7-811135465a-r3ovn2
		//https://api.fastforex.io/fetch-one?from=USD&to=CAD&api_key=a542c21ba7-811135465a-r3ovn2
		//https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=ETH
		String GET_URL = " https://min-api.cryptocompare.com/data/price?fsym="+ fromCode +"&tsyms="+toCode; 
		//String GET_URL = " https://api.fastforex.io/convert?from="  + fromCode + "&to=" + toCode +"&amount=" + Double.toString(amount) +  "&api_key=a542c21ba7-811135465a-r3ovn2";
		
		 // Connect to the URL using java's native library
		URL url = new URL(GET_URL);
		URLConnection request = url.openConnection();
		request.connect();
	 
		// Convert to a JSON object to print data
	    
		// JsonParser jp = new JsonParser(); //from gson
		// String objectJson = new GsonBuilder().setPrettyPrinting().create().toJson(jp);
		// System.out.println(objectJson);
		JsonObject rootobj = new JsonParser().parse(new InputStreamReader((InputStream) request.getContent())).getAsJsonObject(); //Convert the input stream to a json element
		// JsonObject rootobj = root.getAsJsonObject(); //May be an array, may be an object. 
		String exchangeRate = rootobj.get(toCode).getAsString(); 
		System.out.println(exchangeRate);
		System.out.println(deci.format(amount) + fromCode + " = " + deci.format(amount*Double.parseDouble(exchangeRate)) +toCode);
		return amount*Float.parseFloat(exchangeRate);
	    
	}

}