import { Button } from "antd";
import React from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import googleLogo from "../assets/google.png";
import { Link } from "react-router-dom";

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

export default function Login() {
  return (
    <LoginWrapper>
      <img src={logo} className="img" />
      <span className="text">Chào mừng bạn trở lại !</span>
      <Link to="/">
        <Button className="button" type="ghost" shape="round">
          <img src={googleLogo} className="logo" />
          Đăng nhập bằng Google
        </Button>
      </Link>
    </LoginWrapper>
  );
}
