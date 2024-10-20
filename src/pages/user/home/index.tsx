import Product from "@/components/Product";
import user from "@/queryKeys/user.ts";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Button, Carousel, Col, Flex, Row, Typography } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

const Page: FC = () => {
  const { data: categories } = useQuery({
    ...user.category.all(),
  });

  const { data: newProducts } = useQuery({
    ...user.products.new(1),
  });

  const { data: newProductsPages, fetchNextPage } = useInfiniteQuery({
    queryKey: user.products.new().queryKey,
    queryFn: (context) => user.products.new(context.pageParam).queryFn(context),
    getNextPageParam: (_, __, _lastPageParam) => {
      return _lastPageParam + 1;
    },
    initialPageParam: 1,
  });

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
          {categories?.content.map((_, index) => (
            <Link to="/" key={index}>
              <Button>👖</Button>
              <Typography className="mt-2 text-center text-xs">바지</Typography>
            </Link>
          ))}
        </Flex>

        <Flex className="flex-col gap-4">
          <Typography className="font-bold text-lg">첫 구매 한정 특가</Typography>
          <Carousel arrows slidesToShow={2} dots={false}>
            {newProducts?.content.map((product) => (
              <Product {...product} key={product.id} />
            ))}
          </Carousel>
        </Flex>

        <Flex className="flex-col gap-4">
          <Row gutter={[8, 8]}>
            {newProductsPages?.pages.map(({ content }) =>
              content.map((product) => (
                <Col xs={12} md={8} key={product.id}>
                  <Product {...product} />
                </Col>
              )),
            )}
          </Row>
          <Flex className="justify-center p-4">
            <Button onClick={() => fetchNextPage()}>더보기</Button>
          </Flex>
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
