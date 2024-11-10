import Product from "@/components/Product";
import SearchFilterDrawer from "@/pages/user/search/SearchFilterDrawer";
import user from "@/queryKeys/user";
import { RECENT_SEARCH_KEYWORD } from "@/utils/constants";
import { getCookie, setCookie } from "@/utils/cookie";
import { CloseOutlined } from "@ant-design/icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Col, Flex, Input, InputRef, Row, Spin, Typography } from "antd";
import {
  ChangeEvent,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { debounceTime, distinctUntilChanged, fromEvent, map } from "rxjs";

const Page: FC = () => {
  const navigate = useNavigate();
  const refFetchNextPageArea = useRef<HTMLElement>(null);
  const refSearchKeywordInput = useRef<InputRef>(null);
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
    searchParams.set("keyword", value);
    navigate(`/search?${searchParams.toString()}`);
  };

  const onClickDeleteRecentSearchKeyword: MouseEventHandler<HTMLSpanElement> = (e) => {
    setRecentSearchKeywords((prevState) => {
      const {
        currentTarget: { id },
      } = e;
      e.preventDefault();
      const nextState = prevState.filter((recentSearchKeyword) => recentSearchKeyword !== id);
      setCookie(RECENT_SEARCH_KEYWORD, JSON.stringify(nextState));
      return nextState;
    });
  };

  const {
    data: newProductsPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: user.products.all(searchParams.toString()).queryKey,
    queryFn: (context) => user.products.all(searchParams.toString()).queryFn(context),
    getNextPageParam: ({ content }, __, lastPageParam) => {
      return content.length === 0 ? undefined : lastPageParam + 1;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (!refSearchKeywordInput.current?.input) return;
    const subscription = fromEvent<ChangeEvent<HTMLInputElement>>(
      refSearchKeywordInput.current.input,
      "input",
    )
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map(({ target }) => target.value),
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!refFetchNextPageArea.current) return;
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries.some(({ isIntersecting }) => isIntersecting) || hasNextPage) fetchNextPage();
    });
    intersectionObserver.observe(refFetchNextPageArea.current);
    return () => intersectionObserver.disconnect();
  }, [hasNextPage]);

  if (!newProductsPages) return null;

  return (
    <main>
      <Flex className="gap-4 flex-col">
        <Input
          ref={refSearchKeywordInput}
          placeholder="아이템을 검색해보세요"
          onKeyDown={onKeyDownSearch}
        />
        <Flex className="gap-4">
          <Button onClick={onClickSearchFilter}>브랜드</Button>
          <Button onClick={onClickSearchFilter}>카테고리</Button>
        </Flex>
        {recentSearchKeywords.length > 0 && (
          <Flex className="my-4 gap-2 items-center flex-wrap max-h-32 overflow-y-auto">
            <Typography className="text-xs flex-shrink-0 ">최근검색어</Typography>
            {recentSearchKeywords.map((recentSearchKeyword) => {
              searchParams.set("keyword", recentSearchKeyword);
              return (
                <Link key={recentSearchKeyword} to={`/search?${searchParams.toString()}`}>
                  <Button className="text-xs">
                    {recentSearchKeyword}{" "}
                    <CloseOutlined onClick={onClickDeleteRecentSearchKeyword} />
                  </Button>
                </Link>
              );
            })}
          </Flex>
        )}

        {newProductsPages.pages.length > 0 ? (
          <Row gutter={[16, 16]}>
            {newProductsPages.pages.map(({ content }) =>
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
        title="필터"
        placement="bottom"
        closable
        onClose={() => setIsSearchFilterDrawerOpen(false)}
        open={isSearchFilterDrawerOpen}
      />
    </main>
  );
};

export default Page;
