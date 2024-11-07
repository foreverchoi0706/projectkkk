import Product from "@/components/Product";
import user from "@/queryKeys/user";
import { RECENT_SEARCH_KEYWORD } from "@/utils/constants";
import { getCookie, setCookie } from "@/utils/cookie";
import { CloseOutlined } from "@ant-design/icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Col, Drawer, Flex, Form, Input, InputRef, Row, Spin, Typography } from "antd";
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
  const refFetchNextPageArear = useRef<HTMLElement>(null);
  const refSearchKewordInput = useRef<InputRef>(null);
  const [searchParams] = useSearchParams({ size: "15" });
  const [recentSearchKeywords, setRecentSearchKeywords] = useState<string[]>(
    JSON.parse(getCookie(RECENT_SEARCH_KEYWORD) || "[]"),
  );

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
    if (!refSearchKewordInput.current?.input) return;
    const subscription = fromEvent<ChangeEvent<HTMLInputElement>>(
      refSearchKewordInput.current.input,
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
    if (!refFetchNextPageArear.current) return;
    console.log(refFetchNextPageArear.current);

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries.some(({ isIntersecting }) => isIntersecting) || hasNextPage) fetchNextPage();
    });
    intersectionObserver.observe(refFetchNextPageArear.current);
    return () => intersectionObserver.disconnect();
  }, [hasNextPage]);

  if (!newProductsPages) return null;

  return (
    <main>
      <Flex className="gap-4 flex-col">
        <Input
          ref={refSearchKewordInput}
          placeholder="아이템을 검색해보세요"
          onKeyDown={onKeyDownSearch}
        />
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
        <Flex ref={refFetchNextPageArear} className="justify-center">
          <Spin />
        </Flex>
      )}

      <Drawer title="필터" placement="bottom" closable open={false}>
        <Form>
          <Form.Item>
            <Input />
          </Form.Item>
          <Form.Item>
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </main>
  );
};

export default Page;
