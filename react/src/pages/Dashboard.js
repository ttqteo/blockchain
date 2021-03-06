import React, { useContext } from "react";
import styled from "styled-components";
import { Button } from "antd";
import Asset from "../components/Asset.js";
import CoinMain from "../components/CoinMain.js";
import Activity from "../components/Activity.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { AssetContext } from "../Context/AssetProvider";
import { Date } from "prismic-reactjs";
import { format } from "date-fns-tz";
const Wrapper = styled.div`
  max-width: 874px;
  height: 100%;
  margin: 8px auto 0;
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border: 2px solid #ccc;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    margin: 0 auto;
  }
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

function Dashboard() {
  let {
    user: { displayName, uid },
  } = useContext(AuthContext);

  let {
    asset: { list, acti },
  } = useContext(AssetContext);

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

  const handleCopyWallet = (uid) => {
    navigator.clipboard.writeText(uid);
    alert(
      'Sao ch??p ?????a ch??? v?? th??nh c??ng !\n?????a ch??? v?? c???a b???n l?? "' + uid + '"'
    );
  };
  return (
    <Wrapper>
      <PublicKey>
        <div className="info" onClick={() => handleCopyWallet(uid)}>
          <span className="name"> {displayName} </span>
          <span className="key">
            {" "}
            {`${uid ? uid.substring(0, 4) : ""} ... ${
              uid ? uid.substring(uid.length - 4, uid.length) : ""
            }`}{" "}
          </span>
        </div>
      </PublicKey>
      <FunctionWrapper>
        {/* <div className="summary">
          <img className="img" src={eth} alt="" />
          <span className="eth">{list.length !==0 ? list[0].quantity : ""} ETH</span>
          <span className="usd">
            {list.length !==0 ? list[0].quantity * exchangeRateUTHToUsd : 0} USD
          </span>
        </div> */}
        <CoinMain />
        <div className="function">
          <Link to="/buy" className="item">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<i className="fas fa-dollar-sign"></i>}
              className="function-button"
            />
            <span>Mua</span>
          </Link>
          <Link to="/send" className="item">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<i className="far fa-paper-plane"></i>}
              className="function-button"
            />
            <span>G???i</span>
          </Link>
          <Link to="/swap" className="item">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<i className="fas fa-sync-alt"></i>}
              className="function-button"
            />
            <span>?????i</span>
          </Link>
        </div>
      </FunctionWrapper>
      <AAWrapper>
        <div className="heading" onClick={handleClickHeading}>
          <div className="title active">T??i s???n</div>
          <div className="title ">Ho???t ?????ng</div>
        </div>
        <div className="assets__wrapper">
          {uid
            ? list.map((user, index) => {
                return (
                  <Asset
                    key={index}
                    code={user.code}
                    quantity={user.quantity}
                    changeCode={user.code.toLowerCase()}
                  />
                );
              })
            : ""}
        </div>
        <div className="activities_wrapper hide">
          {acti.length !== 0
            ? acti.map((item, index, array) => {
                return (
                  <Activity
                    key={index}
                    type={acti[acti.length - 1 - index].type}
                    wallet={acti[acti.length - 1 - index].wallet}
                    token1={acti[acti.length - 1 - index].token1}
                    value1={acti[acti.length - 1 - index].value1}
                    value2={acti[acti.length - 1 - index].value2}
                    token2={acti[acti.length - 1 - index].token2}
                    date={format(
                      Date(acti[acti.length - 1 - index].time.seconds * 1000),
                      "MMMM dd, yyyy H:mm b"
                    ).toString()}
                  />
                );
              })
            : ""}
        </div>
      </AAWrapper>
    </Wrapper>
  );
}

export default Dashboard;
