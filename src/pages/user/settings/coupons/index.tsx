import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Flex, Input, InputRef, Spin } from "antd";
import { ChangeEvent, FC, KeyboardEventHandler, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fromEvent, debounceTime, distinctUntilChanged, map } from "rxjs";

const Page: FC = () => {
  const navigate = useNavigate();
  const refInput = useRef<InputRef>(null);
  const [searchParams] = useSearchParams({ size: "15", page: "1" });

  const onKeyDownSearch: KeyboardEventHandler<HTMLInputElement> = ({
    key,
    currentTarget: { value },
  }) => {
    if (key !== "Enter") return;
    searchParams.set("keyword", value);
    navigate(`/settings/coupons?${searchParams.toString()}`);
  };

  const { data: coupons, isLoading } = useQuery(user.coupons.all(searchParams.toString()));

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

  if (isLoading || !coupons?.content) return <Spin fullscreen />;
  return (
    <main>
      <Input ref={refInput} placeholder="아이템을 검색해보세요" onKeyDown={onKeyDownSearch} />
      <Flex className="gap-4 flex-col p-4">
        {coupons.content.map(({ id, name }) => (
          <Flex key={id} className="flex-grow border border-gray-50 p-16">
            {id} {name}
          </Flex>
        ))}
      </Flex>
    </main>
  );
};

export default Page;
