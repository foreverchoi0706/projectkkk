import Product from "@/components/Product";
import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Flex, Typography } from "antd";
import { FC } from "react";

const Page: FC = () => {
  const { data: wish } = useQuery({
    ...user.products.wish(),
    initialData: () => ({ content: [], page: 0, totalCount: 0 }),
  });

  return (
    <main className="h-full">
      <Flex className="h-full gap-4 flex-col p-4 flex-grow">
        {wish.content.length > 0 ? (
          wish.content.map((product) => <Product {...product} />)
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
