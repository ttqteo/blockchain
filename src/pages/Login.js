import { Button } from "antd";
import React from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import googleLogo from "../assets/google.png";
import { Link } from "react-router-dom";
import { addDocument } from "../firebase/services";

import { auth } from "../firebase/config";

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
    font-size: 32px;
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
        console.log("Đăng nhập")
        if (data?.isNewUser) {
          addDocument("users", {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            providerId: user.providerId,
            balance: 100,
          });
        }
      })
      .catch((error) => {console.log("Lỗi123",error)});
  };

  return (
    <LoginWrapper>
      <img src={logo} className="img" alt="logo" />
      <span className="text">Chào mừng bạn trở lại !</span>
      {/* <Link to="/"> */}
        <Button className="button" type="ghost" shape="round"
          onClick={() => handleLogin(googleProvider)}
        >
          <img src={googleLogo} className="logo" alt="google" />
          Đăng nhập bằng Google
        </Button>
      {/* </Link> */}
    </LoginWrapper>
  );
}
