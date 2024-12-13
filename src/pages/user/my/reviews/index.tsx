import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Collapse, Flex, Typography, Image } from "antd";
import { type FC } from "react";
import { useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const [searchParams] = useSearchParams({ size: "15", page: "1" });

  const { data: reviews } = useQuery(user.reviews.all(searchParams.toString()));

  if (!reviews) return null;

  return (
    <main className="h-full">
      <Flex className="h-full flex-col gap-4">
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
