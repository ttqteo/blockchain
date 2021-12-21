import React, { useContext } from "react";
import styled from "styled-components";
import { listToken } from "../firebase/tokenList";
import { AuthContext } from "../Context/AuthProvider";
import { db } from "../firebase/config";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

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
    display: flex;
    flex-direction: column;
    color: #000;
    font-size: 18px;
    font-weight: medium;
    line-height: 24px;
    width: 100%;
  }
  .text .message {
    font-size: 28px;
    line-height: 32px;
    font-weight: bold;
  }
  .date {
    font-size: 18px;
    font-style: italic;
    font-weight: medium;
    max-width: 300px;
  }
  @media (max-width: 768px) {
    .text .message {
      font-size: 24px;
      line-height: 28px;
    }
    .date {
      font-size: 14px;
    }
  @media (max-width: 375px) {
    .text .message {
      font-size: 20px;
      line-height: 20px;
      padding-right: 8px;
    }
    .date {
      font-size: 14px;
    }
    .text {
      font-size: 14px;
    }
`;

export default function Activity({
  type,
  wallet,
  token1,
  token2,
  value,
  date,
}) {
  let userStorage = JSON.parse(localStorage.getItem("users"));
  return (
    <Row>
      {type === "buy" ? (
        <img src={listToken[3].logo} className="img" alt="logo" />
      ) : type === "swap" ? (
        listToken.map(
          (item) =>
            item.name === token2 && (
              <img src={item.logo} className="img" alt="logo" />
            )
        )
      ) : (
        listToken.map(
          (item) =>
            item.name === token1 && (
              <img src={item.logo} className="img" alt="logo" />
            )
        )
      )}
      <div className="text">
        <span className="message">
          Bạn đã{" "}
          {type === "buy"
            ? `mua USD`
            : type === "swap"
            ? `đổi ${token1} sang ${token2}`
            : type === "send"
            ? `gửi đến ví ${wallet}`
            : type === "receive"
            ? `nhận từ ví ${wallet}`
            : ""}
        </span>
        <span className="value">
          {type === "buy"
            ? `$${value} USD`
            : type === "swap"
            ? `${value} ${token1} = 300 ${token2}`
            : type === "send"
            ? `${value} ${token1}`
            : type === "receive"
            ? `${value} ${token1}`
            : ""}
        </span>
      </div>
      <span className="date">{date}</span>
    </Row>
  );
}
