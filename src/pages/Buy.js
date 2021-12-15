import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { AssetContext } from "../Context/AssetProvider";
import { doc, setDoc } from "firebase/firestore";
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
  .heading {
    font-size: 16px;
    font-style: italic;
    font-weight: bold;
    color: #ec1515;
    margin-top: 20px;
  }
  .usdController {
    display: flex;
    align-items: center;
    margin-top: 36px;
  }
  .usdController .minus:hover {
    color: #0074dc;
    border: 1px solid #0074dc;
  }
  .usdController .plus {
    background-color: #0074dc;
  }
  .usdController .plus:hover {
    filter: brightness(1.1);
  }
  .usdController .money-wrapper {
    font-size: 40px;
    font-weight: bold;
    margin: 0 16px;
  }
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

export default function Buy() {
  let navigate = useNavigate();
  let userStorage = JSON.parse(localStorage.getItem("users"));
  const [cash, setCash] = useState(0);
  let {
    user: { uid },
  } = useContext(AuthContext);

  let {assetList: {list}} = useContext(AssetContext)

  const handleBuy = () => {
    const value = parseInt(document.getElementById("money").innerText);
    userStorage.map((user) => {
      if (user.uid === uid) {
        //xử lí mua
        let assetBuy = []
        list.map((item)=>{
          if (item.code !== "USD") {
            return assetBuy.push(item)
          }else{
            assetBuy = [
              ...assetBuy,
              {
                code: item.code,
                quantity: item.quantity + value,
                logoURL: item.logoURL
              }
            ]
          }
        })
        // Lưu lại lên firebase
        setDoc(doc(db, "users", uid), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          asset: assetBuy,
          createdAt: user.createdAt,
          activity: user.activity,
        });
      }
    });
    alert("Bạn đã mua " + value + " USD");
    setCash(0);
    navigate("/");

  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <span className="name">Mua</span>
        <Link to="/" className="back">
          <i className="fas fa-angle-left back-icon"></i>Quay lại
        </Link>
      </HeadingWrapper>
      <FunctionWrapper>
        <span className="heading">Lưu ý chỉ mua được USD</span>
        <div className="usdController">
          <Button
            size="large"
            type="ghost"
            shape="circle"
            className="minus"
            icon={<i className="fas fa-minus"></i>}
            onClick={() => setCash(cash - 1)}
          />
          <div className="money-wrapper">
            $
            <span
              id="money"
              contentEditable="true"
              onKeyPress={(e) => e.code === "Enter" && e.preventDefault()}
              suppressContentEditableWarning={true}
            >
              {cash}
            </span>
          </div>
          <Button
            size="large"
            type="primary"
            shape="circle"
            className="plus"
            icon={<i className="fas fa-plus"></i>}
            onClick={() => setCash(cash + 1)}
          />
        </div>
        <Button
          size="large"
          type="primary"
          shape="round"
          className="end-button"
          onClick={handleBuy}
        >
          Hoàn tất
        </Button>
      </FunctionWrapper>
    </Wrapper>
  );
}
