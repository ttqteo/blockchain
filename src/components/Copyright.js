import React from "react";
import styled from "styled-components";

const CopyrightWrapper = styled.div`
  padding: 16px 16px;
  font-size: 16px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.6);
  text-align: center;
  @media (max-width: 375px) {
    font-size: 10px;
  }
`;

export default function Copyright() {
  return (
    <CopyrightWrapper>
      (C) 2021. Bản quyền thuộc về nhóm 16, lập trình Java - FETEL HCMUS
    </CopyrightWrapper>
  );
}
