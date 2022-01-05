import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { listTokenoriginal } from "../firebase/tokenList";
import axios from "axios";
import { collection } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import NumberFormat from "react-number-format";

const Row = styled.div`
  width: 100%;
  height: 100px;
  border-bottom: 2px solid #ccc;
  display: flex;
  align-items: center;
  .img {
    margin: 0 24px;
    width: 40px;
    height: 40px;
    border: 1px solid #333;
    padding: 2px;
    border-radius: 50%;
  }
  .text {
    color: #000;
    font-size: 18px;
    font-weight: medium;
    line-height: 24px;
    width: 100%;
  }
  .text .token {
    font-size: 28px;
    line-height: 38px;
    font-weight: bold;
  }
  .text .token .current_price {
    color: #333;
    font-size: 20px;
    float: right;
    padding-right: 100px;
  }
  @media (max-width: 768px) {
    .text .token {
      font-size: 24px;
      line-height: 28px;
    }
  }
`;

export default function Asset({ quantity, code, changeCode }) {
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
    <Row>
      {listTokenoriginal.map(
        (item, index) =>
          item.name === code && (
            <img key={index} src={item.logo} className="img" alt="" />
          )
      )}
      <div className="text">
        <div className="token">
          {" "}
          {Number.parseFloat(quantity).toFixed(2)} {code}
        </div>

        <div className="usd">
          $
          <span id="toUsd">
            {code !== "USD"
              ? coins
                  .filter((coin) => {
                    return coin.symbol === changeCode;
                  })
                  .map((item, index) => {
                    return (
                      <NumberFormat
                        key={index}
                        thousandsGroupStyle="thousand"
                        value={item.current_price * quantity}
                        prefix=""
                        decimalSeparator="."
                        displayType="text"
                        type="text"
                        thousandSeparator={true}
                        allowNegative={true}
                        decimalScale={3}
                      />
                    );
                  })
              : quantity}
          </span>{" "}
          USD
        </div>
      </div>
    </Row>
  );
}
