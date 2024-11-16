import Product from "@/components/Product";
import useAuth from "@/hooks/useAuth";
import QnaSection from "@/pages/user/products/[id]/qna";
import ReviewSection from "@/pages/user/products/[id]/review";
import OrderDrawer from "@/pages/user/products/OrderDrawer";
import user from "@/queryKeys/user";
import axiosInstance from "@/utils/axiosInstance.ts";
import { TError } from "@/utils/types.ts";
import { HeartFilled, HeartOutlined, RightOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Carousel, Col, Divider, Flex, Row, Tabs, Typography } from "antd";
import { FC, MouseEventHandler, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Page: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useAuth();
  const queryClient = useQueryClient();
  const refReviewSection = useRef<HTMLElement>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("1");

  const likeMutation = useMutation<unknown, TError>({
    mutationFn: () => axiosInstance.post(`/wishList/add?productId=${id}`),
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries(user.products.wish());
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const unlikeMutation = useMutation<unknown, TError>({
    mutationFn: () => axiosInstance.delete(`/wishList/remove?productId=${id}`),
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries(user.products.wish());
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const { data: product, isError } = useQuery(user.products.detail(id));
  const { data: newProducts } = useQuery(user.products.new(1));

  const onClickLike: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.preventDefault();
    const mutation = liked ? unlikeMutation : likeMutation;
    if (mutation.isPending) return;
    mutation.mutate();
  };

  useEffect(() => {
    if (isError) {
      alert("해당 상품을 찾을 수 없습니다");
      navigate(-1);
    }
  }, [isError]);

  useEffect(() => {
    if (!product) return;
    setIsLiked(product.liked);
  }, [product]);

  if (!product) return null;

  const {
    name,
    description,
    discountRate,
    brand,
    price,
    size,
    color,
    liked,
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
            setActiveKey("1");
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
            label: "리뷰",
            children: (
              <ReviewSection ref={refReviewSection} reviewDetailResponses={reviewDetailResponses} />
            ),
          },
          {
            key: "2",
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
            key: "3",
            label: "문의",
            children: <QnaSection qnADetailResponses={qnADetailResponses} />,
          },
        ]}
      />
      <Flex className="border rounded-t-2xl justify-around gap-4 p-4 fixed bottom-0 max-w-[584px] w-full z-10 bg-white">
        <Button
          type="text"
          onClick={onClickLike}
          icon={
            isLiked ? (
              <HeartFilled className="text-pink-500 text-xl" />
            ) : (
              <HeartOutlined className="text-pink-500 text-xl" />
            )
          }
        />
        <Button
          type="primary"
          className="flex-grow"
          onClick={() => {
            if (!data) navigate("/signin");
            setIsOrderDrawerOpen(true);
          }}
        >
          구매하기
        </Button>
      </Flex>
      {isOrderDrawerOpen && (
        <OrderDrawer
          product={product}
          styles={{
            wrapper: {
              boxShadow: "none",
            },
            content: {
              borderRadius: "8px 8px 0 0",
              maxWidth: "600px",
              width: "100%",
              margin: "0 auto",
            },
          }}
          onClose={() => setIsOrderDrawerOpen(false)}
          open={isOrderDrawerOpen}
          placement="bottom"
        />
      )}
    </main>
  );
};

export default Page;
