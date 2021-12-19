import React from "react";
import styled from "styled-components";
import listToken from "../firebase/tokenList";

const TokenRow = styled.div`
  display: flex;
  align-items: center;
  min-height: 60px;
  border-bottom: 1px solid #d9d9d9;
  .img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #333;
    padding: 4px;
    margin-left: 12px;
  }
  .name {
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
    margin-left: 6px;
  }
`;

export default function ModalToken({ token, active }) {
  return (
    <TokenRow className={`token-row ${active ? "active" : ""}`}>
      {listToken.map(
        (item, index) =>
          item.name === token && <img className="img" key={index} src={item.logo} alt="" />
      )}
      <span className="name">{token}</span>
    </TokenRow>
  );
}
