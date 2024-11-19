import user from "@/queryKeys/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Flex, Input, InputRef, Spin, Typography } from "antd";
import { ChangeEvent, FC, KeyboardEventHandler, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounceTime, distinctUntilChanged, fromEvent, map } from "rxjs";

const Page: FC = () => {
  const refFetchNextPageArea = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const refInput = useRef<InputRef>(null);
  const [searchParams] = useSearchParams({ size: "15", page: "1" });

  const onKeyDownSearch: KeyboardEventHandler<HTMLInputElement> = ({
    key,
    currentTarget: { value },
  }) => {
    if (key !== "Enter") return;
    searchParams.set("keyword", value);
    navigate(`/my/coupons?${searchParams.toString()}`);
  };

  const {
    data: couponsPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: user.coupons.pages(searchParams.toString()).queryKey,
    queryFn: (context) => user.coupons.pages(searchParams.toString()).queryFn(context),
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

  useEffect(() => {
    if (!refInput.current?.input) return;
    const subscription = fromEvent<ChangeEvent<HTMLInputElement>>(refInput.current.input, "input")
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map(({ target }) => target.value),
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, []);

  if (!couponsPages) return null;

  return (
    <main className="h-full">
      <Flex className="h-full flex-col gap-4">
        <Input ref={refInput} placeholder="쿠폰을 검색해보세요" onKeyDown={onKeyDownSearch} />
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
        <Flex ref={refFetchNextPageArea}>
          <Spin />
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
