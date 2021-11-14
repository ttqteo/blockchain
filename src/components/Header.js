import React, { useEffect } from "react";
import styled from "styled-components";
import logoName from "../assets/logo_name.png";
import { Avatar, Button } from "antd";
import { Link, useLocation } from "react-router-dom";

const Wrapper = styled.div`
  height: 80px;
  max-width: 940px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 0 16px;
  .header {
    &__right {
      height: 60px;
      width: 100%;
    }
    &__left {
      display: flex;
      align-items: center;
      .home {
        &__text {
          color: #0074dc;
          font-size: 18px;
          line-height: 18px;
          border-bottom: 2px solid #0074dc;
          font-weight: 600;
        }
        &__button {
          background-color: #0074dc;
          font-size: 18px;
          font-weight: bold;
          width: fit-content;
          height: fit-content;
          margin-left: 16px;
        }
        &__text:hover {
          filter: brightness(1.1);
        }
        &__button:hover {
          filter: brightness(1.1);
        }
      }
      .home.disabled {
        display: none;
      }
    }
  }
  .button.disabled {
    display: none;
  }
  .userLogo {
    margin-left: 16px;
  }
  .userLogo.disabled {
    display: none;
  }
  @media (max-width: 768px) {
    height: 60px;

    .header {
      &__right {
        height: 40px;
        width: 100%;
      }
      &__left {
        .home {
          &__text {
            display: none;
          }
          &__button {
            font-size: 16px;
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    .header {
      &__left {
        .button {
          display: none;
        }
      }
  }
`;

export default function Header() {
  let location = useLocation();
  useEffect(() => {
    document
      .querySelector(".header .userLogo")
      .classList.toggle("disabled", !(location.pathname === "/"));
    document
      .querySelector(".header .button")
      .classList.toggle("disabled", location.pathname === "/home");
    document
      .querySelector(".header__left .home")
      .classList.toggle("disabled", !(location.pathname === "/home"));
  }, [location]);
  return (
    <div style={{ width: "100%" }}>
      <Wrapper className="header">
        <Link to="/home">
          <img src={logoName} className="header__right" />
        </Link>
        <div className="header__left">
          <div className="home">
            <Link to="/login">
              <span className="home__text">Chưa có ví ?</span>
              <Button className="home__button" type="primary" shape="round">
                Đăng nhập
              </Button>
            </Link>
          </div>
          <div>
            <Button type="ghost" shape="round" className="button">
              Etherum Mainnet
            </Button>
            <Avatar
              className="userLogo"
              size={40}
              icon={<i className="fas fa-user"></i>}
            />
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
