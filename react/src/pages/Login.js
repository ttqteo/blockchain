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
import axios from "axios";

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
          console.log("new user");
          axios.post(`http://localhost:8080/signup?uid=` + user.uid);
          setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
            asset: [
              {
                code: "ETH",
                quantity: 100,
              },
              {
                code: "BNB",
                quantity: 0,
              },
              {
                code: "BTC",
                quantity: 0,
              },
              {
                code: "ADA",
                quantity: 0,
              },
              {
                code: "SOL",
                quantity: 0,
              },
              {
                code: "USD",
                quantity: 0,
              },
            ],
            activity: [],
            createdAt: serverTimestamp(),
          });
        } else {
          axios.get(`http://localhost:8080/signin`);
        }
      })
      .catch((error) => {
        console.log("Error Login!!!", error);
      });
  };

  return (
    <LoginWrapper>
      <img src={logo} className="img" alt="logo" />
      <span className="text">Ch??o m???ng b???n tr??? l???i !</span>
      <Button
        className="button"
        type="ghost"
        shape="round"
        onClick={() => handleLogin(googleProvider)}
      >
        <img src={googleLogo} className="logo" alt="google" />
        ????ng nh???p b???ng Google
      </Button>
    </LoginWrapper>
  );
}
