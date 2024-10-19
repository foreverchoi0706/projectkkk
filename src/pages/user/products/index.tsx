import Product from "@/components/Product";
import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "antd";
import { FC } from "react";

const Page: FC = () => {
  const { data: products } = useQuery({
    ...user.products.all(),
  });

  if (!products) return null;
  console.log(products.content);

  return (
    <main>
      <Row gutter={[8, 8]}>
        {products.content.map((product, index) => (
          <Col span={8} key={index}>
            <Product {...product} />
          </Col>
        ))}
      </Row>
    </main>
  );
};

export default Page;
