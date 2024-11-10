import Product from "@/components/Product";
import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Divider, Flex, Row, Typography } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

const Page: FC = () => {
  const { data: newProducts } = useQuery(user.products.new(1));
  return (
    <main>
      <Flex className="flex-col justify-center items-center gap-8 p-8">
        <Typography className="text-center font-bold text-2xl">
          장바구니에 담긴 상품이 없어요
        </Typography>
        <Typography className="text-lg">원하는 상품을 담아보세요</Typography>
        <Link to="/search">
          <Button variant="solid" color="primary">
            상품보러가기
          </Button>
        </Link>
      </Flex>
      <Divider className="border-t-8" />
      <Flex className="flex-col gap-8">
        <Typography className="font-bold text-xl">함께 구매하면 좋은 상품</Typography>
        <Row gutter={[8, 8]}>
          {newProducts?.content.map((product) => (
            <Col xs={12} md={8} key={product.id}>
              <Product {...product} />
            </Col>
          ))}
        </Row>
      </Flex>
    </main>
  );
};

export default Page;
