import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import { Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import ModalToken from "../components/ModalToken";

const Wrapper = styled.div`
  max-width: 874px;
  margin: 8px auto 0;
  background-color: #fff;
  border-radius: 20px;
  border: 2px solid #ccc;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    margin: 0 auto;
  }
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
  @media (max-width: 375px) {
    .back {
      font-size: 18px;
      right: 20px;
    }
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
  margin-top: 4px;
  .typeToken1,
  .typeToken2 {
    position: absolute;
    z-index: 99;
    width: 118px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background: #fff;
    min-height: 60px;
  }
  .typeToken1.min,
  .typeToken2.min {
    overflow: hidden;
    height: 60px;
  }
  .typeToken1.min .token-row,
  .typeToken2.min .token-row {
    display: none;
  }
  .typeToken1 .token-row.active,
  .typeToken2 .token-row.active {
    display: flex;
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
  let navigate = useNavigate();

  const handleToggleList1 = (e) => {
    document
      .querySelector(".typeToken1 .token-row.active")
      .classList.remove("active");
    const tokenList = document.querySelectorAll(".typeToken1 .token-row");
    const activeItem = e.target.closest(".typeToken1 .token-row");
    tokenList.forEach((item) =>
      item.classList.toggle("active", activeItem === item)
    );
    document.querySelector(".typeToken1").classList.toggle("min");
  };
  const handleToggleList2 = (e) => {
    document
      .querySelector(".typeToken2 .token-row.active")
      .classList.remove("active");
    const tokenList = document.querySelectorAll(".typeToken2 .token-row");
    const activeItem = e.target.closest(".typeToken2 .token-row");
    tokenList.forEach((item) =>
      item.classList.toggle("active", activeItem === item)
    );
    document.querySelector(".typeToken2").classList.toggle("min");
  };
  const handleSwap = () => {
    alert("Chuyển đổi thành công !");
    navigate("/");
  };
  return (
    <Wrapper>
      <HeadingWrapper>
        <span className="name">Chuyển</span>
        <Link to="/" className="back">
          <i className="fas fa-angle-left back-icon"></i>Quay lại
        </Link>
      </HeadingWrapper>
      <FunctionWrapper>
        <TokenWrapper>
          <span className="heading">Chuyển từ</span>
          <TokenInputWrapper>
            <div
              className="typeToken1 min"
              onClick={handleToggleList1}
              style={{ zIndex: "100" }}
            >
              <ModalToken token="ETH" active />
              <ModalToken token="BNB" />
              <ModalToken token="BTC" />
              <ModalToken token="ADA" />
              <ModalToken token="SOL" />
              <ModalToken token="USD" />
            </div>
            <Input className="inputType" placeholder="Số lượng Token" />
          </TokenInputWrapper>
          <div className="description">Có 2.4545 ETH khả dụng</div>
        </TokenWrapper>
        <TokenWrapper>
          <span className="heading">Thành</span>
          <TokenInputWrapper>
            <div className="typeToken2 min" onClick={handleToggleList2}>
              <ModalToken token="ETH" active />
              <ModalToken token="BNB" />
              <ModalToken token="BTC" />
              <ModalToken token="ADA" />
              <ModalToken token="SOL" />
              <ModalToken token="USD" />
            </div>
            <Input className="inputType" placeholder="Số lượng Token" />
          </TokenInputWrapper>
        </TokenWrapper>
        <Button
          size="large"
          type="primary"
          shape="round"
          className="end-button"
          onClick={handleSwap}
        >
          Chuyển
        </Button>
      </FunctionWrapper>
    </Wrapper>
  );
}
