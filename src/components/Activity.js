import React from "react";
import styled from "styled-components";
import ETH from "../assets/eth_logo.png";

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
  return (
    <Row>
      <img src={ETH} className="img" />
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
