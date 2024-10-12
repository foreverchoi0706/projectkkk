import { Button, Divider, Flex, Typography } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

const Page: FC = () => {
  return (
    <main>
      <Flex className="flex-col justify-center items-center gap-8 p-8">
        <Typography className="font-bold text-2xl">장바구니에 담긴 상품이 없어요</Typography>
        <Typography className="text-lg">원하는 상품을 담아보세요</Typography>
        <Link to="/products">
          <Button variant="solid" color="primary">
            상품보러가기
          </Button>
        </Link>
      </Flex>
      <Divider />
      <Flex className="gap-8 p-8">
        <Typography className="font-bold text-xl">함께 구매하면 좋은 상품</Typography>
      </Flex>
    </main>
  );
};

export default Page;
