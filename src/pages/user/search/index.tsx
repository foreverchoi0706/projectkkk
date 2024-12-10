import Product from "@/components/Product";
import SearchFilterDrawer from "@/pages/user/search/SearchFilterDrawer";
import user from "@/queryKeys/user";
import { RECENT_SEARCH_KEYWORD } from "@/utils/constants";
import { getCookie, setCookie } from "@/utils/cookie";
import { CloseOutlined, RollbackOutlined } from "@ant-design/icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Col, Flex, Input, Row, Spin, Typography } from "antd";
import { FC, KeyboardEventHandler, MouseEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const refFetchNextPageArea = useRef<HTMLElement>(null);
  const [isSearchFilterDrawerOpen, setIsSearchFilterDrawerOpen] = useState<boolean>(false);
  const [searchParams] = useSearchParams({ size: "15" });
  const [recentSearchKeywords, setRecentSearchKeywords] = useState<string[]>(
    JSON.parse(getCookie(RECENT_SEARCH_KEYWORD) || "[]"),
  );

  const onClickSearchFilter = () => {
    setIsSearchFilterDrawerOpen(true);
  };

  const onKeyDownSearch: KeyboardEventHandler<HTMLInputElement> = ({
    key,
    currentTarget: { value },
  }) => {
    if (key !== "Enter") return;
    setRecentSearchKeywords((prevState) => {
      const nextState = prevState.includes(value) ? prevState : prevState.concat(value);
      setCookie(RECENT_SEARCH_KEYWORD, JSON.stringify(nextState));
      return nextState;
    });
    searchParams.set("content", value);
    navigate(`/search?${searchParams.toString()}`);
  };

  const onClickDeleteRecentSearchKeyword = (e: MouseEvent<HTMLSpanElement>, keyword: string) => {
    e.preventDefault();
    setRecentSearchKeywords((prevState) => {
      const nextState = prevState.filter((recentSearchKeyword) => recentSearchKeyword !== keyword);
      setCookie(RECENT_SEARCH_KEYWORD, JSON.stringify(nextState));
      return nextState;
    });
  };

  const {
    data: productPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: user.products.pages(searchParams.toString()).queryKey,
    queryFn: (context) => user.products.pages(searchParams.toString()).queryFn(context),
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

  if (!productPages) return <Spin fullscreen />;

  return (
    <main>
      <Flex className="gap-4 flex-col">
        <Input
          placeholder="아이템을 검색해보세요"
          defaultValue={searchParams.get("productName") || ""}
          onKeyDown={onKeyDownSearch}
        />
        <Flex className="gap-4">
          <Button onClick={onClickSearchFilter}>필터</Button>
          <Button type="text" onClick={() => navigate("/search")} icon={<RollbackOutlined />} />
        </Flex>
        {recentSearchKeywords.length > 0 && (
          <Flex className="my-4 gap-2 items-center flex-wrap max-h-32 overflow-y-auto">
            <Typography className="text-xs flex-shrink-0 ">최근검색어</Typography>
            {recentSearchKeywords.map((recentSearchKeyword) => {
              const urlSearchParams = new URLSearchParams(searchParams.toString());
              urlSearchParams.set("keyword", recentSearchKeyword);
              return (
                <Link key={recentSearchKeyword} to={`/search?${urlSearchParams.toString()}`}>
                  <Button className="text-xs">
                    {recentSearchKeyword}{" "}
                    <CloseOutlined
                      onClick={(e) => onClickDeleteRecentSearchKeyword(e, recentSearchKeyword)}
                    />
                  </Button>
                </Link>
              );
            })}
          </Flex>
        )}

        {productPages.pages[0].content.length > 0 ? (
          <Row gutter={[8, 8]}>
            {productPages.pages.map(({ content }) =>
              content.map((product) => (
                <Col key={product.id} xs={12} md={8}>
                  <Product {...product} />
                </Col>
              )),
            )}
          </Row>
        ) : (
          <Flex className="flex-col gap-4 flex-grow justify-center items-center">
            <Typography className="text-5xl">😥</Typography>
            <Typography className="text-2xl">검색결과가 없습니다</Typography>
          </Flex>
        )}
      </Flex>
      {hasNextPage && (
        <Flex ref={refFetchNextPageArea} className="justify-center">
          <Spin />
        </Flex>
      )}

      <SearchFilterDrawer
        placement="bottom"
        closeIcon={false}
        onClose={() => setIsSearchFilterDrawerOpen(false)}
        open={isSearchFilterDrawerOpen}
      />
    </main>
  );
};

export default Page;
