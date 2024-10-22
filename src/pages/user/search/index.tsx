import { RECENT_SEARCH_KEYWORD } from "@/utils/constants";
import { getCookie, setCookie } from "@/utils/cookie";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Typography } from "antd";
import { FC, KeyboardEventHandler, MouseEventHandler, useState } from "react";
import { Link } from "react-router-dom";

const Page: FC = () => {
  const [recentSearchKeywords, setRecentSearchKeywords] = useState<string[]>(
    JSON.parse(getCookie("RECENT_SEARCH_KEYWORD") || "[]"),
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
  };

  const onClickDeleteRecentSearchKeyword: MouseEventHandler<HTMLSpanElement> = (e) => {
    setRecentSearchKeywords((prevState) => {
      const {
        currentTarget: { id },
      } = e;
      e.preventDefault();
      const nextState = prevState.filter((ecentSearchKeyword) => ecentSearchKeyword !== id);
      setCookie(RECENT_SEARCH_KEYWORD, JSON.stringify(nextState));
      return nextState;
    });
  };

  return (
    <main>
      <Input placeholder="아이템을 검색해보세요" onKeyDown={onKeyDownSearch} />
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
    </main>
  );
};

export default Page;
