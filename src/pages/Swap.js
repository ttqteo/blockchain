import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import { Input } from "antd";
import eth from "../assets/eth_logo.png";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  width: 874px;
  margin: 8px auto 0;
  background-color: #fff;
  border-radius: 20px;
  border: 2px solid #ccc;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
`;

const HeadingWrapper = styled.div`
  position: relative;
  border-bottom: 2px solid #ccc;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  .name {
    font-size: 36px;
    font-weight: bold;
  }
  .back {
    position: absolute;
    right: 32px;
    font-size: 24px;
    color: #0074dc;
    border-bottom: 1px solid #0074dc;
    cursor: pointer;
  }
  .back .back-icon {
    margin-right: 4px;
  }
  .back:hover {
    filter: brightness(1.1);
  }
`;

const FunctionWrapper = styled.div`
  height: 310px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  .end-button {
    margin-top: 16px;
    background-color: #0074dc;
    font-size: 20px;
    height: fit-content;
    width: fit-content;
  }
  .end-button:hover {
    filter: brightness(1.1);
  }
`;

const TokenWrapper = styled.div`
  margin-top: 10px;
  .heading {
    font-size: 20px;
    font-weight: 600;
    margin-left: 16px;
  }
  .description {
    font-size: 12px;
    font-weight: medium;
    font-style: italic;
    margin-left: 16px;
  }
`;

const TokenInputWrapper = styled.div`
  position: relative;
  .typeToken {
    position: absolute;
    z-index: 99;
    width: 118px;
    border-right: 2px solid #d9d9d9;
    height: 60px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .typeToken .img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #333;
    padding: 4px;
    margin-left: 12px;
  }
  .typeToken .name {
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
    margin-left: 6px;
  }
  .inputType {
    width: 315px;
    height: 60px;
    border-radius: 20px;
    font-size: 20px;
  }
  .inputType:valid {
    padding-left: 135px;
  }
`;

export default function Swap() {
  return (
    <Wrapper>
      <HeadingWrapper>
        <span className="name">Chuyển</span>
        <Link to="/" className="back">
          <i class="fas fa-angle-left back-icon"></i>Quay lại
        </Link>
      </HeadingWrapper>
      <FunctionWrapper>
        <TokenWrapper>
          <span className="heading">Chuyển từ</span>
          <TokenInputWrapper>
            <div className="typeToken">
              <img className="img" src={eth} />
              <span className="name">ETH</span>
            </div>
            <Input className="inputType" placeholder="Số lượng Token" />
          </TokenInputWrapper>
          <div className="description">Có 2.4545 ETH khả dụng</div>
        </TokenWrapper>
        <TokenWrapper>
          <span className="heading">Thành</span>
          <TokenInputWrapper>
            <div className="typeToken">
              <img className="img" src={eth} />
              <span className="name">ETH</span>
            </div>
            <Input className="inputType" placeholder="Số lượng Token" />
          </TokenInputWrapper>
        </TokenWrapper>
        <Button
          size="large"
          type="primary"
          shape="round"
          className="end-button"
        >
          Chuyển
        </Button>
      </FunctionWrapper>
    </Wrapper>
  );
}
