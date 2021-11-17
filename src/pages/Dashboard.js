import React, { useContext } from "react";
import styled from "styled-components";
import { Button } from "antd";
// import { user } from "../firebase/api.js";
import eth from "../assets/eth_logo.png";
import Asset from "../components/Asset.js";
import Activity from "../components/Activity.js";
import { Link } from "react-router-dom";
import {auth} from "../firebase/config";
import { useNavigate } from 'react-router-dom';  
import { AuthContext } from "../Context/AuthProvider";
const Wrapper = styled.div`
  width: 874px;
  height: calc(100vh - 88px);
  margin: 8px auto 0;
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border: 2px solid #ccc;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
`;

const PublicKey = styled.div`
  border-bottom: 2px solid #ccc;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  .info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 90%;
    width: 300px;
  }
  .info .name {
    font-size: 20px;
    font-weight: bold;
  }
  .info .key {
    font-size: 18;
    font-weight: medium;
  }
  .info:hover {
    width: 200px;
    border-radius: 20px;
    background: rgba(204, 204, 204, 0.25);
    display: flex;
    cursor: pointer;
  }
`;

const FunctionWrapper = styled.div`
  border-bottom: 2px solid #ccc;
  height: 310px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  .summary {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .summary .img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #333;
    padding: 4px;
  }
  .summary .eth {
    margin: 16px 0 11px;
    font-size: 40px;
    line-height: 40px;
    font-weight: bold;
  }
  .summary .usd {
    font-size: 24px;
    line-height: 24px;
    font-weight: medium;
  }
  .function {
    margin-top: 33px;
    display: flex;
    justify-content: center;
  }
  .function .item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .function .item:nth-child(2) {
    margin: 0 32px;
  }
  .function .item span {
    font-size: 20px;
    font-weight: bold;
    margin-top: 3px;
    color: #333;
  }
  .function .function-button {
    background-color: #0074dc;
  }
  .function .function-button:hover {
    filter: brightness(1.1);
  }
`;

const AAWrapper = styled.div`
  .heading {
    display: flex;
    flex-direction: row;
  }
  .heading .title {
    font-size: 20px;
    font-weight: medium;
    line-height: 24px;
    color: #666;
    width: calc(100% / 2);
    border-bottom: 2px solid #ccc;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .heading .title.active {
    color: #000;
    font-weight: bold;
    border-bottom: 4px solid #000;
  }
  .assets__wrapper {
    overflow-y: scroll;
    width: 100%;
    height: calc(100vh - 540px);
  }
  .assets__wrapper.hide {
    display: none;
  }
  .button {
    margin: 24px auto 32px;
    display: flex;
    justify-content: center;
  }
  .button button {
    background-color: #0074dc;
    font-size: 24px;
    width: fit-content;
    height: fit-content;
  }
  .activities_wrapper {
    overflow-y: scroll;
    width: 100%;
    height: calc(100vh - 540px);
  }
  .activities_wrapper.hide {
    display: none;
  }
`;

export default function Dashboard() {
  let {
    user: { displayName, uid, balance},
  } = useContext(AuthContext);
  const exchangeRateUTHToUsd = 4158.45;
  const handleClickHeading = (e) => {
    document
      .querySelectorAll(".heading .title")
      .forEach((value) => value.classList.remove("active"));
    e.target.classList.toggle("active");
    document.querySelectorAll(".heading .title").forEach((value, index) => {
      if (value.closest(".active")) {
        document
          .querySelector(".assets__wrapper")
          .classList.toggle("hide", index === 1);
        document
          .querySelector(".activities_wrapper")
          .classList.toggle("hide", index === 0);
      }
    });
  };

  return (
   
    <Wrapper>
      <PublicKey>
        <div className="info">
          <span className="name"> {displayName} </span>
          <span className="key"> {uid} </span>
          <Button
            onClick={()=>auth.signOut()}
           >thoát</Button>
        </div>
      </PublicKey>
      <FunctionWrapper>
        <div className="summary">
          <img className="img" src={eth} alt='' />
          <span className="eth">{balance} ETH</span>
          <span className="usd">{balance*exchangeRateUTHToUsd} USD</span>
        </div>
        <div className="function">
          <Link to="/buy" className="item">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<i class="fas fa-dollar-sign"></i>}
              className="function-button"
            />
            <span>Mua</span>
          </Link>
          <Link to="/send" className="item">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<i class="far fa-paper-plane"></i>}
              className="function-button"
            />
            <span>Gửi</span>
          </Link>
          <Link to="/swap" className="item">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<i class="fas fa-sync-alt"></i>}
              className="function-button"
            />
            <span>Đổi</span>
          </Link>
        </div>
      </FunctionWrapper>
      <AAWrapper>
        <div className="heading" onClick={handleClickHeading}>
          <div className="title active">Tài sản</div>
          <div className="title ">Hoạt động</div>
        </div>
        <div className="assets__wrapper">
          <Asset name="ETH" value="2" />
          <Asset name="ETH" value="2" />
          <Asset name="ETH" value="2" />
          <Asset name="ETH" value="2" />
          <Asset name="ETH" value="2" />
          <Asset name="ETH" value="2" />
          <Asset name="ETH" value="2" />
          <div className="button">
            <Button type="primary" shape="round" size="large">
              Thêm đồng mới
            </Button>
          </div>
        </div>
        <div className="activities_wrapper hide">
          <Activity
            type="buy"
            wallet=""
            token1=""
            value="100"
            token2=""
            date="12:15PM Nov 10th, 2021"
          />
          <Activity
            type="swap"
            wallet=""
            token1="ETH"
            value="100"
            token2="BNB"
            date="12:15PM Nov 10th, 2021"
          />
          <Activity
            type="send"
            wallet="0x1234...abcd"
            token1="ETH"
            value="100"
            token2=""
            date="12:15PM Nov 10th, 2021"
          />
          <Activity
            type="receive"
            wallet="0x1234...abcd"
            token1="ETH"
            value="100"
            token2=""
            date="12:15PM Nov 10th, 2021"
          />
          <div className="button">
            <Button type="primary" shape="round" size="large">
              Thêm giao dịch mới
            </Button>
          </div>
        </div>
      </AAWrapper>
    </Wrapper>
  );
}
