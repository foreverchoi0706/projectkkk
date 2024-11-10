import user from "@/queryKeys/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Flex, Spin, Typography } from "antd";
import { FC, useEffect, useRef } from "react";

const Page: FC = () => {
  const refFetchNextPageArea = useRef<HTMLElement>(null);

  const {
    data: shippingPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: user.shipping.all().queryKey,
    queryFn: (context) => user.shipping.all().queryFn(context),
    getNextPageParam: ({ content }, __, lastPageParam) => {
      return content.length === 0 ? undefined : lastPageParam + 1;
    },
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

  if (!shippingPages) return null;

  return (
    <main className="h-full">
      <Flex className="gap-4 flex-col flex-grow">
        {shippingPages.pages.length > 0 ? (
          shippingPages.pages.map(({ content }) =>
            content.map(({ id, products }) => (
              <Flex key={id} className="flex-grow border border-gray-200 p-16">
                {id} {JSON.stringify(products)}
              </Flex>
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
