import React, { memo, useContext, useState } from "react";
import styled from "styled-components";
import { AutoComplete, Button, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { listToken } from "../firebase/tokenList";
import axios from "axios";

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

  const coinCodeData = ["ETH", "BNB", "BTC", "ADA", "SOL", "USD"];
  const [selectedCoin, setSelectedCoin] = useState(coinCodeData[0]);
  const handleTransaction = () => {
    const receiver = document.getElementById("receiver").value;
    const value = parseInt(document.getElementById("token").value);
    console.log(receiver);
    console.log(uid);
    axios.post(
      `http://localhost:8080/send?uid1=` +
        uid +
        `&uid2=` +
        receiver +
        `&token=` +
        selectedCoin +
        `&value=` +
        value
    );
    alert(
      "Bạn đã chuyển thành công " +
        value +
        " " +
        selectedCoin +
        " đến ví " +
        receiver
    );
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
          id="receiver"
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
            id="token"
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
