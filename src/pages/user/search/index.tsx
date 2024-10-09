import { getCookie, setCookie } from "@/utils/cookie.ts";
import { Input } from "antd";
import { FC, KeyboardEventHandler, useState } from "react";

const Page: FC = () => {
  const [_recentSearchKeywords, _setRecentSearchKeywords] = useState<string[]>();

  const onKeyDownSearch: KeyboardEventHandler<HTMLInputElement> = ({
    key,
    currentTarget: { value },
  }) => {
    if (key !== "Enter") return;
    setCookie("RECENT_SEARCH_KEYWORD", value);
  };
  return (
    <main>
      <Input onKeyDown={onKeyDownSearch} />
      최근 검색어 {JSON.stringify(getCookie("RECENT_SEARCH_KEYWORD"))}
    </main>
  );
};

export default Page;
