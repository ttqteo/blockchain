import React, { memo, useContext, useState } from "react";
import styled from "styled-components";
import { AutoComplete, Button, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { AssetContext } from "../Context/AssetProvider";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import listToken from "../firebase/tokenList";

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
    margin-top: 36px;
    background-color: #0074dc;
    font-size: 20px;
    height: fit-content;
    width: fit-content;
  }
  .end-button:hover {
    filter: brightness(1.1);
  }
  .inputWallet {
    margin-top: 32px;
    width: 315px;
  }
  .inputToken {
    margin-top: 32px;
    width: 315px;
    .ant-select-selector {
      font-size: 16px;
      display: flex;
      align-items: center;
      padding-bottom: 4px;
    }
  }
`;

function Send() {
  let navigate = useNavigate();

  let {
    user: { uid },
  } = useContext(AuthContext);
  let {
    assetList: { list },
  } = useContext(AssetContext);
  let userStorage = JSON.parse(localStorage.getItem("users"));
  const coinCodeData = ["ETH", "BNB", "BTC", "ADA", "SOL", "USD"];
  const [selectedCoin, setSelectedCoin] = useState(coinCodeData[0]);
  const [receiver, setReceiver] = useState("");
  const [quantity, setQuantity] = useState(0);
  const handleTransaction = () => {
    alert("Gửi thành công !");
    userStorage.map((user) => {
      if (user.uid === receiver) {
        // xử lí asset mới của ng nhận
        let userReceiver = user.asset;
        let assetReceiver = [];
        userReceiver.map((item) => {
          if (item.code !== selectedCoin) {
            return assetReceiver.push(item);
          } else {
            console.log(item.quantity);
            assetReceiver = [
              ...assetReceiver,
              {
                code: item.code,
                quantity: item.quantity + parseInt(quantity),
                logoURL: item.logoURL,
              },
            ];
          }
        });
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
        // xử lí asset mới của ng gửi
        let assetSender = [];
        user.asset.map((item) => {
          if (item.code !== selectedCoin) {
            return assetSender.push(item);
          } else {
            console.log(item.quantity);
            assetSender = [
              ...assetSender,
              {
                code: item.code,
                quantity: item.quantity - parseInt(quantity),
                logoURL: item.logoURL,
              },
            ];
          }
        });
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
    window.location.reload();
    navigate("/");
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
        <Input
          className="inputWallet"
          placeholder="Nhập ví cần gửi"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          allowClear
          size="large"
        />
        <Input.Group size="large" compact className="inputToken">
          <Select
            style={{ width: "35%" }}
            defaultValue="ETH"
            onChange={(e) => {
              setSelectedCoin(e);
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
            style={{ width: "65%" }}
            placeholder="Số lượng Token"
            options={[{ value: "10" }, { value: "100" }]}
          />
        </Input.Group>
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

export default memo(Send);
