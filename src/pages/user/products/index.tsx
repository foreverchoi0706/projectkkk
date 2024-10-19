import Product from "@/components/Product";
import { Col, Row } from "antd";
import { FC } from "react";

const Page: FC = () => {
  return (
    <main>
      <Row gutter={[8, 8]}>
        {[...new Array(100)].map((_, index) => (
          <Col span={8} key={index}>
            <Product id={index} />
          </Col>
        ))}
      </Row>
    </main>
  );
};

export default Page;
