import React, { memo, useContext, useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { AssetContext } from "../Context/AssetProvider";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
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
    margin-top: 36px;
    background-color: #0074dc;
    font-size: 20px;
    height: fit-content;
    width: fit-content;
  }
  .end-button:hover {
    filter: brightness(1.1);
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-top: 32px;
  .type {
    position: absolute;
    z-index: 99;
    top: -12px;
    left: 24px;
    height: 24px;
    background-color: #0074dc;
    padding: 0 24px;
    font-size: 16px;
    color: #fff;
    border-radius: 20px;
  }
  .inputType {
    width: 315px;
    height: 60px;
    border-radius: 20px;
    font-size: 20px;
  }
  .inputType:valid {
    padding-left: 16px;
  }
`;

const TokenInputWrapper = styled.div`
  position: relative;
  margin-top: 32px;
  .typeToken {
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
  .typeToken.min {
    overflow: hidden;
    height: 60px;
  }
  .typeToken.min .token-row {
    display: none;
  }
  .typeToken .token-row.active {
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

function Send() {
  let navigate = useNavigate();

  let {
    user: { displayName, uid },
  } = useContext(AuthContext);
  let {assetList: {list}} = useContext(AssetContext)
  console.log(list,"send")
  let userStorage = JSON.parse(localStorage.getItem("users"));
  const [receiver, setReceiver] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState("");
  const handleTransaction = () => {
    alert("Gửi thành công !");
    userStorage.map((user) => {
      if (user.uid === receiver) {
        user.asset[0].quantity = user.asset[0].quantity + parseInt(quantity);
        // xử lí asset mới của ng nhận
        let assetReceiver = []
        list.map((item)=>{
          if (item.code !== "ETH") {
            return assetReceiver.push(item)
          }else{
            assetReceiver = [
              ...assetReceiver,
              {
                code: item.code,
                quantity:user.asset[0].quantity,
                logoURL: item.logoURL
              }
            ]
          }
        })
        // Lưu dữ liệu người nhận lên firebase
        setDoc(doc(db, "users", user.uid), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          asset: assetReceiver,
          createdAt: user.createdAt,
          activity: user.activity,
        });
      }
      if (user.uid === uid) {
        user.asset[0].quantity = user.asset[0].quantity - parseInt(quantity);   
        // xử lí asset mới của ng gửi
        let assetSender = []
        user.asset.map((item)=>{
          if (item.code !== "ETH") {
            return assetSender.push(item)
          }else{
            assetSender = [
              ...assetSender,
              {
                code: item.code,
                quantity:user.asset[0].quantity,
                logoURL: item.logoURL
              }
            ]
          }
        })
        setDoc(doc(db, "users", user.uid), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          asset: assetSender,
          createdAt: user.createdAt,
          activity: user.activity,
        });
      }
    });
    setQuantity(0);
    setReceiver("");
    navigate("/");
  };

  const handleToggleList = (e) => {
    document.querySelector(".token-row.active").classList.remove("active");
    const tokenList = document.querySelectorAll(".token-row");
    const activeItem = e.target.closest(".token-row");
    tokenList.forEach((item) =>
      item.classList.toggle("active", activeItem === item)
    );
    document.querySelector(".typeToken").classList.toggle("min");
  };
  return (
    <Wrapper>
      <HeadingWrapper>
        <span className="name">Gửi</span>
        <Link to="/" className="back">
          <i className="fas fa-angle-left back-icon"></i>Quay lại
        </Link>
      </HeadingWrapper>
      <FunctionWrapper>
        <InputWrapper>
          <div className="type">Gửi đến ví</div>
          <Input
            className="inputType"
            placeholder="Nhập ví cần gửi"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </InputWrapper>
        <TokenInputWrapper>
          <div className="typeToken min" onClick={handleToggleList}>
            <ModalToken token="ETH" active />
            <ModalToken token="BNB" />
            <ModalToken token="BTC" />
            <ModalToken token="ADA" />
            <ModalToken token="SOL" />
          </div>
          <Input
            className="inputType"
            placeholder="Số lượng Token"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </TokenInputWrapper>
        <Button
          size="large"
          type="primary"
          shape="round"
          className="end-button"
          onClick={handleTransaction}
        >
          Gửi
        </Button>
      </FunctionWrapper>
    </Wrapper>
  );
}

export default memo(Send)