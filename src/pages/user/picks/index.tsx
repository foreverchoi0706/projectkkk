import Product from "@/components/Product";
import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Col, Flex, Row, Typography } from "antd";
import { FC } from "react";

const Page: FC = () => {
  const { data: wish } = useQuery(user.products.wish());

  if (!wish) return null;

  return (
    <main className="h-full">
      <Flex className="h-full gap-4 flex-col flex-grow">
        {wish.content.length > 0 ? (
          <Row gutter={[8, 8]}>
            {wish.content.map((product) => (
              <Col xs={12} md={8} key={product.id}>
                <Product {...product} />
              </Col>
            ))}
          </Row>
        ) : (
          <Flex className="flex-col gap-4 flex-grow justify-center items-center">
            <Typography className="text-5xl">😥</Typography>
            <Typography className="text-2xl">찜한 아이템이 없습니다</Typography>
            <Typography className="text-xl text-center">
              하트를 눌러 마음에 드는 상품을 찜해보세요
            </Typography>
          </Flex>
        )}
      </Flex>
    </main>
  );
};

export default Page;
