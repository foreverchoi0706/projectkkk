import user from "@/queryKeys/user";
import getRandomProductImage from "@/utils/getRandomProductImage";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Divider, Flex, Spin, Typography } from "antd";
import { FC, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Page: FC = () => {
  const refFetchNextPageArea = useRef<HTMLElement>(null);

  const {
    data: orderPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: user.order.pages().queryKey,
    queryFn: (context) => user.order.pages().queryFn(context),
    getNextPageParam: ({ content }, __, lastPageParam) =>
      content.length === 0 ? undefined : lastPageParam + 1,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (!refFetchNextPageArea.current) return;
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries.some(({ isIntersecting }) => isIntersecting) || hasNextPage) fetchNextPage();
    });
    intersectionObserver.observe(refFetchNextPageArea.current);
    return () => intersectionObserver.disconnect();
  }, [hasNextPage]);

  if (!orderPages) return null;

  return (
    <main className="h-full">
      <Flex className="gap-4 flex-col flex-grow">
        {orderPages.pages[0].content.length > 0 ? (
          orderPages.pages.map(({ content }) =>
            content.map(({ id, deliveryAddress, orderNum, totalAmount, orderDate }) => (
              <Link key={id} to={`/my/orders/${id}`}>
                <Flex className="flex-col flex-grow border border-gray-200 p-4">
                  <Flex className="justify-between items-center">
                    <img
                      className="rounded"
                      width="80"
                      height="80"
                      alt="img"
                      src={getRandomProductImage()}
                    />
                    <Flex className="flex-col">
                      <Typography>주문번호 {orderNum}</Typography>
                      <Typography className="text-end">
                        {new Intl.DateTimeFormat("ko-KR").format(new Date(orderDate))}
                      </Typography>
                    </Flex>
                  </Flex>
                  <Divider />
                  <Flex className="justify-between">
                    <Typography>
                      {new Intl.NumberFormat("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                      }).format(totalAmount)}
                    </Typography>
                    <Typography>{deliveryAddress}</Typography>
                  </Flex>
                </Flex>
              </Link>
            )),
          )
        ) : (
          <Flex className="flex-col gap-4 flex-grow justify-center items-center">
            <Typography className="text-5xl">😥</Typography>
            <Typography className="text-2xl">주문이 없습니다</Typography>
          </Flex>
        )}
      </Flex>
      {hasNextPage && (
        <Flex ref={refFetchNextPageArea} className="justify-center">
          <Spin />
        </Flex>
      )}
    </main>
  );
};

export default Page;
