import Product from "@/components/Product";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Button, Carousel, Col, Flex, Row, Typography } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

const Page: FC = () => {
  return (
    <main>
      <Flex className="flex-col gap-4">
        <Carousel>
          <img
            className="rounded"
            alt="img"
            src="https://cf.image-farm.s.zigzag.kr/original/cms/2024/09/27/202409270520214482_061783.jpg?width=1029&height=1029&quality=100&format=webp&transparent=true"
          />
          <img
            className="rounded"
            alt="img"
            src="https://cf.image-farm.s.zigzag.kr/original/cms/2024/10/02/202410021202530837_041069.jpg"
          />
          <img
            className="rounded"
            alt="img"
            src="https://cf.image-farm.s.zigzag.kr/original/cms/2024/10/04/202410040917163324_093565.jpg"
          />
          <img
            className="rounded"
            alt="img"
            src="https://cf.image-farm.s.zigzag.kr/original/cms/2024/10/02/202410021202530837_041069.jpg"
          />
        </Carousel>

        <Flex className="gap-4 overflow-x-auto">
          <Link to="">
            <Button>
              <UnorderedListOutlined />
            </Button>
            <Typography className="mt-2 text-center text-xs">전체</Typography>
          </Link>
          {[...new Array(10)].map(() => (
            <Link to="/">
              <Button>👖</Button>
              <Typography className="mt-2 text-center text-xs">바지</Typography>
            </Link>
          ))}
        </Flex>

        <Carousel arrows slidesToShow={3} dots={false}>
          {[...new Array(10)].map((_, index) => (
            <Product key={index} />
          ))}
        </Carousel>

        <Row gutter={[8, 8]}>
          {[...new Array(9)].map((_, index) => (
            <Col span={8} key={index}>
              <Product />
            </Col>
          ))}
        </Row>
      </Flex>
    </main>
  );
};

export default Page;
