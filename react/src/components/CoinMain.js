
import React, {useEffect,useState} from 'react';
import eth from "../assets/token/eth_original.png";
import axios from "axios";
import { collection} from "firebase/firestore";
import { onSnapshot} from "firebase/firestore";
import { db } from "../firebase/config";

export default function CoinMain({quantity}){
    const [coins, setCoins] = useState([]);
    useEffect(() => {
        const newData = onSnapshot(collection(db, 'users'), (snapshot) =>{
          axios
            .get(
              "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
            )
            .then((res) => {
              setCoins(res.data)
            })
            .catch((error) => console.log(error));
        })
        return newData
      }, [])
    return(
            <div className="summary">
            <img className="img" src={eth} alt="" />
            <span className="eth">{quantity} ETH</span>
            <span className="usd">
            {coins.filter((coin)=>{
                    return (coin.symbol === "eth")
                }).map((item)=>{
                    console.log(item.current_price,"CoinMain")
                    return (item.current_price*quantity).toFixed(0)
                    })} USD
            </span>
            </div>
    )
}