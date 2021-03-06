import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import img1 from "../assets/homepage_1.png";
import img2 from "../assets/homepage_2.png";
import img3 from "../assets/homepage_3.png";

const HomeWrapper = styled.div`
  margin: 0 auto;
  @media (max-width: 768px) {
    .even {
      flex-direction: column-reverse;
    }
  }
`;

const RowWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  .img {
    max-width: 470px;
    padding: 0 40px;
    &__home {
      width: 100%;
      height: 100%;
    }
  }
  .text {
    max-width: 470px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    .heading {
      max-width: 400px;
      font-size: 28px;
      line-height: 38px;
      font-weight: bold;
    }
    .description {
      max-width: 400px;
      margin: 16px 0 32px;
      font-size: 18px;
      line-height: 24px;
    }
    .button {
      background-color: #0074dc;
      font-size: 18px;
      font-weight: bold;
      height: fit-content;
      width: fit-content;
    }
    .button:hover {
      filter: brightness(1.1);
    }
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    .img {
      max-width: 300px;
    }
    .text {
      padding: 0 16px;
      align-items: center;
      margin-top: 24px;
      .heading,
      .description {
        text-align: center;
      }
      .heading {
        font-size: 26px;
      }
      .description {
        font-size: 16px;
      }
    }
  }
`;

export default function Home() {
  return (
    <HomeWrapper>
      <RowWrapper>
        <div className="img">
          <img src={img1} className="img__home" alt="" />
        </div>
        <div className="text">
          <span className="heading">
            {" "}
            Ví đồng tiền điện tử & Công nghệ Blockchain{" "}
          </span>
          <span className="description">
            {" "}
            Bắt đầu tạo ví ngay bây giờ để sở hữu những ưu đãi mới nhất{" "}
          </span>
          <Link to="/login">
            <Button type="primary" shape="round" className="button">
              Tạo ví mới ngay
            </Button>
          </Link>
        </div>
      </RowWrapper>
      <RowWrapper className="even">
        <div className="text">
          <span className="heading"> Mua, bán và chuyển đổi </span>
          <span className="description">
            {" "}
            Sử dụng trên trình duyệt web, có thể đăng nhập mọi lúc, mọi nơi. Có
            thể sử dụng tài khoản Google để đăng kí{" "}
          </span>
        </div>
        <div className="img">
          <img src={img2} className="img__home" alt="" />
        </div>
      </RowWrapper>
      <RowWrapper>
        <div className="img">
          <img src={img3} className="img__home" alt="" />
        </div>
        <div className="text">
          <span className="heading"> Sở hữu dữ liệu của bạn </span>
          <span className="description">
            {" "}
            Tài khoản ví và tài khoản đăng nhập là của bạn{" "}
          </span>
          <span className="heading"> Chương trình mã nguồn mở </span>
          <span className="description"> Kết nối với chúng tôi </span>
        </div>
      </RowWrapper>
    </HomeWrapper>
  );
}
