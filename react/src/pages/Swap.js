import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { AutoComplete, Button, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { listToken } from "../firebase/tokenList";
import { AuthContext } from "../Context/AuthProvider";
import axios from "axios";
import { collection } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const { Option } = Select;

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
  .heading {
    font-size: 20px;
    font-weight: 600;
    margin-top: 10px;
  }
  .description {
    font-size: 12px;
    font-weight: medium;
    font-style: italic;
    margin-left: 16px;
  }
  .inputToken {
    margin-top: 4px;
    width: 315px;
    .ant-select-selector {
      font-size: 16px;
      display: flex;
      align-items: center;
      padding-bottom: 4px;
    }
  }
  .ant-select-disabled.ant-select:not(.ant-select-customize-input)
    .ant-select-selector
    input {
    cursor: not-allowed;
    color: #333;
    font-weight: bold;
  }
`;

export default function Swap() {
  let navigate = useNavigate();
  let userStorage = JSON.parse(localStorage.getItem("users"));
  let {
    user: { uid },
  } = useContext(AuthContext);

  const handleSwap = () => {
    const value = parseInt(document.getElementById("value").value);
    console.log(value);
    axios.post(
      `http://localhost:8080/swap?uid=` +
        uid +
        `&token1=` +
        coinFrom +
        `&value=` +
        value +
        `&token2=` +
        coinTo
    );
    alert(
      "Bạn đã đổi thành công " + value + " " + coinFrom + " sang " + coinTo
    );
    navigate("/");
  };

  const [coinFrom, setCoinFrom] = useState("ETH");
  const [quantityFrom, setQuantityFrom] = useState(0);
  const [changeFrom, setChangeFrom] = useState(0);
  const [coinTo, setCoinTo] = useState("ETH");
  const [changeTo, setChangeTo] = useState(0);
  const [isValid, setIsValid] = useState(true);
  useEffect(() => {
    const newData = onSnapshot(collection(db, "users"), (snapshot) => {
      axios
        .get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
        )
        .then((res) => {
          res.data.map((item) => {
            if (coinFrom.toLowerCase() === item.symbol) {
              setChangeFrom(item.current_price);
            }
            if (coinTo.toLowerCase() === item.symbol) {
              setChangeTo(item.current_price);
            }
          });
        })
        .catch((error) => console.log(error));
    });
    return newData;
  }, [coinFrom, coinTo]);

  userStorage.map((user) => {
    if (user.uid === uid) {
      return user.asset.map((item) => {
        if (item.code === coinFrom) {
          if (quantityFrom > item.quantity) {
            if (isValid === true) setIsValid(false);
          } else {
            if (isValid === false) setIsValid(true);
          }
        }
      });
    }
  });
  console.log(coinFrom, quantityFrom, changeFrom);
  console.log(isValid);
  console.log(coinTo, changeTo);
  return (
    <Wrapper>
      <HeadingWrapper>
        <span className="name">Chuyển</span>
        <Link to="/" className="back">
          <i className="fas fa-angle-left back-icon"></i>Quay lại
        </Link>
      </HeadingWrapper>
      <FunctionWrapper>
        <span className="heading">Chuyển từ</span>
        <Input.Group size="large" compact className="inputToken">
          <Select
            style={{ width: "35%" }}
            defaultValue="ETH"
            onChange={(e) => {
              setCoinFrom(e);
            }}
          >
            <Option value="ETH">
              <img
                src={listToken[0].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              ETH
            </Option>
            <Option value="BNB">
              <img
                src={listToken[1].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              BNB
            </Option>
            <Option value="BTC">
              <img
                src={listToken[2].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              BTC
            </Option>
            <Option value="USD">
              <img
                src={listToken[3].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              USD
            </Option>
            <Option value="ADA">
              <img
                src={listToken[4].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              ADA
            </Option>
            <Option value="SOL">
              <img
                src={listToken[5].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              SOL
            </Option>
          </Select>
          <AutoComplete
            style={{
              width: "65%",
              border: isValid === false ? "1px solid #ff0000" : "",
            }}
            placeholder="Số lượng Token"
            options={[{ value: "10" }, { value: "100" }]}
            onChange={(e) => {
              setQuantityFrom(e);
            }}
            id="value"
          />
        </Input.Group>
        <div className="description">
          Có{" "}
          {userStorage.map((user) => {
            if (user.uid === uid) {
              return user.asset.map((item) => {
                if (item.code === coinFrom) {
                  return item.quantity;
                }
              });
            }
          })}{" "}
          {coinFrom} khả dụng
        </div>
        <span className="heading">Thành</span>
        <Input.Group size="large" compact className="inputToken">
          <Select
            style={{ width: "35%" }}
            defaultValue="ETH"
            onChange={(e) => {
              setCoinTo(e);
            }}
          >
            <Option value="ETH">
              <img
                src={listToken[0].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              ETH
            </Option>
            <Option value="BNB">
              <img
                src={listToken[1].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              BNB
            </Option>
            <Option value="BTC">
              <img
                src={listToken[2].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              BTC
            </Option>
            <Option value="USD">
              <img
                src={listToken[3].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              USD
            </Option>
            <Option value="ADA">
              <img
                src={listToken[4].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              ADA
            </Option>
            <Option value="SOL">
              <img
                src={listToken[5].logo}
                alt=""
                style={{
                  marginRight: "4px",
                }}
              />{" "}
              SOL
            </Option>
          </Select>
          <AutoComplete
            disabled
            value={((quantityFrom * changeFrom) / changeTo).toFixed(3)}
            style={{ width: "65%", color: "red !important" }}
            placeholder="Số lượng Token"
            options={[{ value: "10" }, { value: "100" }]}
          />
        </Input.Group>
        <Button
          disabled={isValid ? false : true}
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
