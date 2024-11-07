import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Flex, Input, InputRef, Spin, Typography } from "antd";
import { ChangeEvent, FC, KeyboardEventHandler, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounceTime, distinctUntilChanged, fromEvent, map } from "rxjs";

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

  const { data: shipping } = useQuery(user.shipping.all(searchParams.toString()));

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

  if (!shipping) return <Spin fullscreen />;

  return (
    <main className="h-full">
      <Flex className="h-full flex-col gap-4">
        <Input ref={refInput} placeholder="주문을 검색해보세요" onKeyDown={onKeyDownSearch} />
        <Flex className="gap-4 flex-col flex-grow">
          {shipping.content.length > 0 ? (
            shipping.content.map(({ id, products }) => (
              <Flex key={id} className="flex-grow border border-gray-200 p-16">
                {id} {JSON.stringify(products)}
              </Flex>
            ))
          ) : (
            <Flex className="flex-col gap-4 flex-grow justify-center items-center">
              <Typography className="text-5xl">😥</Typography>
              <Typography className="text-2xl">주문이 없습니다</Typography>
            </Flex>
          )}
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
