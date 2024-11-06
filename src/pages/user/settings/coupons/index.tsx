import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Flex, Input, InputRef, Typography } from "antd";
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

  const { data: coupons } = useQuery(user.coupons.all(searchParams.toString()));

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

  if (!coupons) return null;  

  return (
    <main className="h-full">
      <Flex className="h-full flex-col gap-4">
        <Input ref={refInput} placeholder="쿠폰을 검색해보세요" onKeyDown={onKeyDownSearch} />
        <Flex className="gap-4 flex-col flex-grow">
          {coupons.content.length > 0 ? (
            coupons.content.map(({ id, name, startDate, endDate, discountRate }) => (
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
            ))
          ) : (
            <Flex className="flex-col gap-4 flex-grow justify-center items-center">
              <Typography className="text-5xl">😥</Typography>
              <Typography className="text-2xl">쿠폰이 없습니다</Typography>
            </Flex>
          )}
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
