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
import { Link } from "react-router-dom";
import { debounceTime, distinctUntilChanged, fromEvent, of, switchMap } from "rxjs";

const Page: FC = () => {
  const refInput = useRef<InputRef>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [recentSearchKeywords, setRecentSearchKeywords] = useState<string[]>(
    JSON.parse(getCookie(RECENT_SEARCH_KEYWORD) || "[]"),
  );

  const { data = [] } = useQuery(user.products.all());

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

  useEffect(() => {
    if (!refInput.current?.input) return;
    const subscrition = fromEvent<ChangeEvent<HTMLInputElement>>(refInput.current.input, "input")
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(({ target }) => {
          return of(target.value);
        }),
      )
      .subscribe(setSearchKeyword);
    return () => subscrition.unsubscribe();
  }, []);

  return (
    <main>
      <Input ref={refInput} placeholder="아이템을 검색해보세요" onKeyDown={onKeyDownSearch} />
      {recentSearchKeywords.length > 0 && (
        <Flex className="my-4 gap-2 items-center flex-wrap max-h-32 overflow-y-auto">
          <Typography className="text-xs flex-shrink-0 ">최근검색어</Typography>
          {recentSearchKeywords.map((recentSearchKeyword) => (
            <Link key={recentSearchKeyword} to={`/search?keyword=${recentSearchKeyword}`}>
              <Button className="text-xs">
                {recentSearchKeyword}{" "}
                <CloseOutlined
                  id={recentSearchKeyword}
                  onClick={onClickDeleteRecentSearchKeyword}
                />
              </Button>
            </Link>
          ))}
        </Flex>
      )}
      {JSON.stringify(data)}
    </main>
  );
};

export default Page;
