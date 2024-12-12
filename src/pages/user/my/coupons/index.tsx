import user from "@/queryKeys/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Flex, Spin, Typography } from "antd";
import { type FC, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const refFetchNextPageArea = useRef<HTMLElement | null>(null);
  const [searchParams] = useSearchParams({ size: "15", page: "1" });

  const {
    data: couponsPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: user.coupons.pages(searchParams.toString()).queryKey,
    queryFn: (context) => user.coupons.pages(searchParams.toString()).queryFn(context),
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

  if (!couponsPages) return null;

  return (
    <main className="h-full">
      <Flex className="h-full flex-col gap-4">
        <Flex className="gap-4 flex-col flex-grow">
          {couponsPages.pages[0].content.length > 0 ? (
            couponsPages.pages.map(({ content }) =>
              content.map(({ id, name, discountRate, startDate, endDate }) => (
                <Flex key={id} className="flex-col gap-4 p-4 border border-gray-200 rounded">
                  <Flex className="justify-between items-center">
                    <Typography className="font-bold text-lg">{name}</Typography>
                    <Typography className="text-pink-500 text-2xl font-bold">
                      {discountRate}%
                    </Typography>
                  </Flex>
                  <Typography className="text-end font-medium">
                    {new Intl.DateTimeFormat("ko-KR").format(new Date(startDate))}~
                    {new Intl.DateTimeFormat("ko-KR").format(new Date(endDate))}
                  </Typography>
                </Flex>
              )),
            )
          ) : (
            <Flex className="flex-col gap-4 flex-grow justify-center items-center">
              <Typography className="text-5xl">😥</Typography>
              <Typography className="text-2xl">쿠폰이 없습니다</Typography>
            </Flex>
          )}
        </Flex>
        {hasNextPage && (
          <Flex ref={refFetchNextPageArea}>
            <Spin />
          </Flex>
        )}
      </Flex>
    </main>
  );
};

export default Page;
