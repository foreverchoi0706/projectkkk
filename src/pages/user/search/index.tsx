import { RECENT_SEARCH_KEYWORD } from "@/utils/constants";
import { getCookie, setCookie } from "@/utils/cookie";
import user from "@/queryKeys/user";
import { CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Flex, Input, InputRef, Typography } from "antd";
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
import Product from "@/components/Product";

const Page: FC = () => {
  const navigate = useNavigate();
  const refInput = useRef<InputRef>(null);
  const [searchParams] = useSearchParams({ size: "15", page: "1" });
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

  const { data: products } = useQuery({
    ...user.products.all(searchParams.toString()),
    initialData: () => ({ content: [], page: 0, totalCount: 0 }),
  });

  useEffect(() => {
    if (!refInput.current?.input) return;
    const subscrition = fromEvent<ChangeEvent<HTMLInputElement>>(refInput.current.input, "input")
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map(({ target }) => target.value),
      )
      .subscribe();
    return () => subscrition.unsubscribe();
  }, []);

  return (
    <main>
      <Input ref={refInput} placeholder="아이템을 검색해보세요" onKeyDown={onKeyDownSearch} />
      {recentSearchKeywords.length > 0 && (
        <Flex className="my-4 gap-2 items-center flex-wrap max-h-32 overflow-y-auto">
          <Typography className="text-xs flex-shrink-0 ">최근검색어</Typography>
          {recentSearchKeywords.map((recentSearchKeyword) => {
            searchParams.set("keyword", recentSearchKeyword);
            return (
              <Link key={recentSearchKeyword} to={`/search?${searchParams.toString()}`}>
                <Button className="text-xs">
                  {recentSearchKeyword} <CloseOutlined onClick={onClickDeleteRecentSearchKeyword} />
                </Button>
              </Link>
            );
          })}
        </Flex>
      )}
      {products.content.map((product) => (
        <Product {...product} />
      ))}
    </main>
  );
};

export default Page;
