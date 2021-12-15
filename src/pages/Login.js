import { Button } from "antd";
import React from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import googleLogo from "../assets/google.png";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/config";
import { db } from "../firebase/config";

import {
  signInWithPopup,
  getAdditionalUserInfo,
  GoogleAuthProvider,
} from "firebase/auth";

const LoginWrapper = styled.div`
  max-width: 940px;
  margin: 0 auto;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .img {
    max-width: 258px;
    max-height: 258px;
  }
  .text {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 32px;
  }
  .button {
    font-size: 20px;
    font-weight: bold;
    height: fit-content;
    width: fit-content;
    display: flex;
    align-items: center;
    .logo {
      margin-right: 8px;
      width: 20px;
      height: 20px;
    }
    .button:hover {
      color: #0074dc;
    }
  }
`;
const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const handleLogin = async (provider) => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const data = getAdditionalUserInfo(result);
        if (data?.isNewUser) {
          // addDocument("users", {
          //   displayName: user.displayName,
          //   email: user.email,
          //   photoURL: user.photoURL,
          //   uid: user.uid,
          //   providerId: user.providerId,
          //   balance: 100,
          // });
          setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
            asset: [
              {
                code: "ETH",
                quantity: 150,
                logoURL: "https://cryptorunner.com/wp-content/uploads/2017/10/ethereum-symbol.png",
              },
              {
               code: "BNB",
               quantity: 17.5,
               logoURL: "https://th.bing.com/th/id/OIP.joIRFGbuK3AsFH8pTSUnZgHaHa?pid=ImgDet&rs=1",
             },
             {
               code: "BTC",
               quantity: 143,
               logoURL: "https://th.bing.com/th/id/OIP.gYEEYXuJLYw03cV0_ANzcwHaHa?pid=ImgDet&rs=1",
             },
             {
               code: "ADA",
               quantity: 27,
               logoURL: "https://th.bing.com/th/id/OIP.bv3opyCP290QI6iGEjZsiQAAAA?pid=ImgDet&rs=1",
             },
             {
               code: "SOL",
               quantity: 68,
               logoURL: "https://cdn2.vectorstock.com/i/thumb-large/22/21/solana-sol-token-symbol-cryptocurrency-logo-vector-39742221.jpg",
             },
             {
               code: "USD",
               quantity: 1000,
               logoURL: "https://th.bing.com/th/id/R.3704b75bbdacf82e6c508f1ef1afd46f?rik=RMZ4CEQ4o%2bMpUA&pid=ImgRaw&r=0",
             }
            ],
            activity: {
              buy:{
                quantity:0,
                createdAt: serverTimestamp(),
              }
            },
            createdAt: serverTimestamp(),
          });
        }
      })
      .catch((error) => {
        console.log("Error Login!!!", error);
      });
  };

  return (
    <LoginWrapper>
      <img src={logo} className="img" alt="logo" />
      <span className="text">Chào mừng bạn trở lại !</span>
      {/* <Link to="/"> */}
      <Button
        className="button"
        type="ghost"
        shape="round"
        onClick={() => handleLogin(googleProvider)}
      >
        <img src={googleLogo} className="logo" alt="google" />
        Đăng nhập bằng Google
      </Button>
      {/* </Link> */}
    </LoginWrapper>
  );
}
