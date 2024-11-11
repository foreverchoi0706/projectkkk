import Product from "@/components/Product";
import QnaSection from "@/pages/user/products/[id]/qna";
import ReviewSection from "@/pages/user/products/[id]/review";
import user from "@/queryKeys/user";
import { RightOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Carousel, Col, Divider, Flex, Row, Tabs, Typography } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Page: FC = () => {
  const { id } = useParams();
  const refReviewSection = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<string>("1");

  const { data: product, isError } = useQuery(user.products.detail(id));

  const { data: newProducts } = useQuery(user.products.new(1));

  useEffect(() => {
    if (isError) {
      alert("해당 상품을 찾을 수 없습니다");
      navigate(-1);
    }
  }, [isError]);

  if (!product) return null;

  const {
    name,
    description,
    discountRate,
    brand,
    price,
    size,
    color,
    qnADetailResponses,
    reviewDetailResponses,
  } = product;

  return (
    <main>
      <Carousel autoplay>
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
      <Divider className="border-t-8" />
      <Flex className="justify-between items-center">
        <Typography className="text-gray-500">
          {brand} <RightOutlined />
        </Typography>
        <Typography
          className="text-gray-500 text-xl"
          onClick={() =>
            window.navigator.clipboard.writeText(brand).then(() => alert("복사되었습니다"))
          }
        >
          <ShareAltOutlined className="cursor-pointer" />
        </Typography>
      </Flex>
      <Divider className="border-t-8" />
      <Flex className="gap-4 flex-col">
        <Typography>{name}</Typography>

        <Flex className="gap-2">
          <Typography className="font-bold">{discountRate}%</Typography>
          <Typography className="line-through">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
            }).format(price)}
          </Typography>
        </Flex>

        <Typography className="font-bold text-3xl text-pink-500">
          {new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
          }).format(Math.round((price * (100 - discountRate)) / 100))}
        </Typography>
        <Typography>{description}</Typography>

        <Flex className="gap-4">
          <Button>{size}</Button>
        </Flex>

        <Flex className="gap-4">
          <Button>{color}</Button>
        </Flex>

        <Button
          type="default"
          onClick={() => {
            setActiveKey("2");
            setTimeout(() => {
              if (!refReviewSection.current) return;
              refReviewSection.current.scrollIntoView({ behavior: "smooth" });
            }, 0);
          }}
        >
          리뷰보기
        </Button>
      </Flex>
      <Divider className="border-t-8" />
      <Flex className="flex-col gap-4">
        <Typography className="font-bold text-lg">첫 구매 한정 특가</Typography>
        <Carousel arrows autoplay slidesToShow={2} dots={false}>
          {newProducts?.content.map((product) => (
            <Product {...product} key={product.id} />
          ))}
        </Carousel>
      </Flex>
      <Divider className="border-t-8" />
      <Flex className="flex-col gap-4">
        <Typography className="font-bold text-lg">함께 보면 좋은 상품</Typography>
        <Carousel arrows autoplay slidesToShow={2} dots={false}>
          {newProducts?.content.map((product) => (
            <Product {...product} key={product.id} />
          ))}
        </Carousel>
      </Flex>
      <Divider className="border-t-8" />
      <Tabs
        size="large"
        onChange={(value) => setActiveKey(value)}
        activeKey={activeKey}
        defaultActiveKey="1"
        className="w-full"
        type="card"
        items={[
          {
            key: "1",
            label: "상품정보",
            children: "상품정보입니다",
          },
          {
            key: "2",
            label: `리뷰 ${reviewDetailResponses.totalCount}`,
            children: (
              <ReviewSection ref={refReviewSection} reviewDetailResponses={reviewDetailResponses} />
            ),
          },
          {
            key: "3",
            label: "추천",
            children: (
              <Row gutter={[8, 8]}>
                {newProducts?.content.map((product) => (
                  <Col xs={12} md={8} key={product.id}>
                    <Product {...product} />
                  </Col>
                ))}
              </Row>
            ),
          },
          {
            key: "4",
            label: "문의",
            children: <QnaSection qnADetailResponses={qnADetailResponses} />,
          },
        ]}
      />
    </main>
  );
};

export default Page;
