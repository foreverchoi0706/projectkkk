import { FC } from "react";
import { Typography } from "antd";

const Page: FC = () => {
  return (
    <ul>
      <li>상품 검색은 따로 필요없고 그 기능은 전체상품조회에 녹여야함</li>
      <li>상품 상세 이름이 아닌 id로 검색되게</li>
      <li>상품 삭제 이름이 아닌 id로 삭제되게</li>
      <li>상품 상세 추가,수정,삭제 요청시 403 (Forbidden) 에러 남 Invalid CORS request 이슈</li>
      <li>상품 상세에 판매량이 null로 내려오는데 의도한건지? 아니라면 기본값 0으로</li>
      <li>
        <Typography.Title>멤버 API도 마찬가지로 수정!</Typography.Title>
      </li>
      <li>회원가입 성공 시에도 로그인 성공시와 같은 값이 내려와야함</li>
      <li>오류 포맷도 맞춰야함</li>
    </ul>
  );
};

export default Page;
