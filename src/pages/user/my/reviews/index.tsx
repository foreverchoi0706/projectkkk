import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Flex, Input, type InputRef, Typography } from "antd";
import { type ChangeEvent, type FC, type KeyboardEventHandler, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounceTime, distinctUntilChanged, fromEvent, map } from "rxjs";

const Page: FC = () => {
  const navigate = useNavigate();
  const refInput = useRef<InputRef | null>(null);
  const [searchParams] = useSearchParams({ size: "15", page: "1" });

  const onKeyDownSearch: KeyboardEventHandler<HTMLInputElement> = ({
    key,
    currentTarget: { value },
  }) => {
    if (key !== "Enter") return;
    searchParams.set("keyword", value);
    navigate(`/my/coupons?${searchParams.toString()}`);
  };

  const { data: reviews } = useQuery(user.reviews.all(searchParams.toString()));

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

  if (!reviews) return null;

  return (
    <main className="h-full">
      <Flex className="h-full flex-col gap-4">
        <Input ref={refInput} placeholder="리뷰를 검색해보세요" onKeyDown={onKeyDownSearch} />
        <Flex className="gap-4 flex-col flex-grow">
          {reviews.content.length > 0 ? (
            reviews.content.map((_, index) => (
              <Flex key={index} className="border border-gray-200 p-4">
                {index}
              </Flex>
            ))
          ) : (
            <Flex className="flex-col gap-4 flex-grow justify-center items-center">
              <Typography className="text-5xl">😥</Typography>
              <Typography className="text-2xl">리뷰가 없습니다</Typography>
            </Flex>
          )}
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
