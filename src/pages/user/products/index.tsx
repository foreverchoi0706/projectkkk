import Product from "@/components/Product";
import user from "@/queryKeys/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Col, Flex, Row } from "antd";
import { FC } from "react";

const Page: FC = () => {
  const { data: productsPages, fetchNextPage } = useInfiniteQuery({
    queryKey: user.products.all().queryKey,
    queryFn: (context) => user.products.all(context.pageParam).queryFn(context),
    getNextPageParam: (_, __, _lastPageParam) => {
      return _lastPageParam + 1;
    },
    initialPageParam: 1,
  });

  console.log(productsPages);

  if (!productsPages) return null;

  return (
    <main>
      <Row gutter={[8, 8]}>
        {productsPages.pages.map(({ content }) =>
          content.map((product) => (
            <Col span={8} key={product.id}>
              <Product {...product} />
            </Col>
          )),
        )}
      </Row>
      <Flex className="justify-center p-4">
        <Button onClick={() => fetchNextPage()}>더보기</Button>
      </Flex>
    </main>
  );
};

export default Page;
