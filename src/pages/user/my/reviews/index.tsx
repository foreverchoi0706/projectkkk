import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Collapse, Flex, Input, type InputRef, Typography, Image } from "antd";
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
            <Collapse
              items={reviews.content.map(
                ({
                  reviewId,
                  description,
                  helpful,
                  imageUrl1,
                  imageUrl2,
                  imageUrl3,
                  createAt,
                }) => ({
                  key: reviewId,
                  label: (
                    <Flex className="justify-between">
                      <Typography>{description}</Typography>
                      <Typography>👍{helpful}</Typography>
                    </Flex>
                  ),
                  children: (
                    <Flex className="flex-col gap-4">
                      <Flex className="justify-between">
                        <Typography>{description}</Typography>
                        <Typography>
                          {new Intl.DateTimeFormat("ko-KR").format(new Date(createAt))}
                        </Typography>
                      </Flex>
                      <Flex className="gap-4">
                        <Image src={imageUrl1} alt="imageUrl1" />
                        <Image src={imageUrl2} alt="imageUrl2" />
                        <Image src={imageUrl3} alt="imageUrl3" />
                      </Flex>
                    </Flex>
                  ),
                }),
              )}
            />
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
