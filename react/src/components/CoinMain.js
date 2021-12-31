import React, { useEffect, useState, useContext } from "react";
import eth from "../assets/token/eth_original.png";
import axios from "axios";
import { collection } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import NumberFormat from "react-number-format";
import { AssetContext } from "../Context/AssetProvider";
export default function CoinMain() {
  let sumUSD = 0;
  let sumETH = 0;
  let {
    asset: { list },
  } = useContext(AssetContext);
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const newData = onSnapshot(collection(db, "users"), (snapshot) => {
      axios
        .get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
        )
        .then((res) => {
          setCoins(res.data);
        })
        .catch((error) => console.log(error));
    });
    return newData;
  }, []);
  return (
    <div className="summary">
      <img className="img" src={eth} alt="" />
      {list.length !== 0
        ? list.map((item) => {
            coins.map((coin) => {
              if (coin.symbol === item.code.toLowerCase())
                sumETH =
                  sumETH +
                  (item.quantity * coin.current_price) / coins[1].current_price;
            });
          })
        : ""}
      <span className="eth"> {list ? sumETH.toFixed(3) : ""} ETH</span>
      <span className="usd">
        {list.length !== 0
          ? list.map((item) => {
              coins.map((coin) => {
                if (coin.symbol === item.code.toLowerCase())
                  sumUSD = sumUSD + item.quantity * coin.current_price;
              });
            })
          : ""}

        <NumberFormat
          thousandsGroupStyle="thousand"
          value={list.leng !== 0 ? sumUSD : ""}
          prefix=""
          decimalSeparator="."
          displayType="text"
          type="text"
          thousandSeparator={true}
          allowNegative={true}
          suffix=" USD"
          decimalScale={3}
        />
      </span>
    </div>
  );
}
