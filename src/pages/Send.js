import React, {useContext, useState} from "react";
import styled from "styled-components";
import { Button } from "antd";
import { Input } from "antd";
import eth from "../assets/eth_logo.png";
import { Link } from "react-router-dom";
import {AuthContext} from "../Context/AuthProvider";
import { doc, setDoc  } from "firebase/firestore";
import { db } from "../firebase/config";

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

export default function Send() {
  let {user: { displayName, uid, balance },} = useContext(AuthContext);
  let userStorage = JSON.parse(localStorage.getItem('users'));
  const [receiver, setReceiver] = useState("")
  const [quantity,setQuantity] = useState(0)
  const handleTransaction = () => {

      userStorage.map((user)=>{
        if (user.uid===receiver){
          user.balance = user.balance + parseInt(quantity);
          setDoc(doc(db, "users", user.uid), {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            providerId: user.providerId,
            balance: user.balance,
          });
        }
        if (user.uid === uid) {
          user.balance = user.balance - parseInt(quantity);
          setDoc(doc(db, "users", user.uid), {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            providerId: user.providerId,
            balance: user.balance,
          });
        }
      })
      setQuantity(0)
      setReceiver("")
  }
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
          <Input className="inputType" placeholder="Nhập ví cần gửi" 
            value = {receiver}
            onChange={(e)=>setReceiver(e.target.value)}
          />
        </InputWrapper>
        <TokenInputWrapper>
          <div className="typeToken">
            <img className="img" src={eth} alt=""/>
            <span className="name">ETH</span>
          </div>
          <Input className="inputType" placeholder="Số lượng Token" 
            value = {quantity}
            onChange={(e)=>setQuantity(e.target.value)}
          />
        </TokenInputWrapper>
        <Button
          size="large"
          type="primary"
          shape="round"
          className="end-button"
          onClick= {handleTransaction}
        >
          Gửi
        </Button>
      </FunctionWrapper>
    </Wrapper>
  );
}
