import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Flex, Typography } from "antd";
import { FC } from "react";
import { useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const [searchParams] = useSearchParams({ size: "15", page: "1" });

  const { data: qnas } = useQuery({
    ...user.coupons.all(searchParams.toString()),
    initialData: () => ({ content: [], page: 0, totalCount: 0 }),
  });

  if (!qnas) return null;

  return (
    <main className="h-full">
      <Flex className="h-full flex-col">
        <Flex className="gap-4 flex-col p-4 flex-grow">
          {qnas.content.length > 0 ? (
            qnas.content.map(({ id, name }) => (
              <Flex key={id} className="flex-grow border border-gray-50 p-16">
                {id} {name}
              </Flex>
            ))
          ) : (
            <Flex className="flex-col gap-4 flex-grow justify-center items-center">
              <Typography className="text-5xl">😥</Typography>
              <Typography className="text-2xl">QnA가 없습니다</Typography>
            </Flex>
          )}
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
