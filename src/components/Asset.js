import React from "react";
import styled from "styled-components";


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
  }
  .text .token {
    font-size: 28px;
    line-height: 32px;
    font-weight: bold;
  }
  @media (max-width: 768px) {
    .text .token {
      font-size: 24px;
      line-height: 28px;
    }
`;

export default function Asset({ logoURL, quantity, code }) {
  return (
    <Row>
      <img src={logoURL} className="img" alt="" />
      <div className="text">
        <span className="token">
          {" "}
          {quantity} {code}
        </span>
        <span className="usd">
          $<span id="toUsd">6.600</span> USD
        </span>
      </div>
      
    </Row>
  );
}