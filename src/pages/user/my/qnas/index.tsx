import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Flex, Typography } from "antd";
import { type FC, useState } from "react";
import { useSearchParams } from "react-router-dom";
import QnAModal from "./QnAModal";

const Page: FC = () => {
  const [searchParams] = useSearchParams({ size: "15", page: "1" });
  const [selectedQnAId, setSelectQnAId] = useState<number | null>(null);

  const { data: qnas } = useQuery(user.qnas.all(searchParams.toString()));

  if (!qnas) return null;

  return (
    <main className="h-full">
      <Flex className="h-full flex-col">
        <Flex className="gap-4 flex-col p-4 flex-grow">
          {qnas.content.length > 0 ? (
            qnas.content.map(({ subject, qnAId, createAt, qnAType, answerStatus }) => (
              <Flex
                key={qnAId}
                className="cursor-pointer flex-col gap-4 p-4 border border-gray-200 rounded"
                onClick={() => setSelectQnAId(qnAId)}
              >
                <Flex className="justify-between items-center">
                  <Typography className="font-bold text-lg">
                    [{qnAType}] {subject}
                  </Typography>
                  <Typography className="text-pink-500 text-2xl font-bold">
                    {answerStatus}
                  </Typography>
                </Flex>
                <Typography className="text-end font-medium">
                  {new Intl.DateTimeFormat("ko-KR").format(new Date(createAt))}
                </Typography>
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
      {selectedQnAId !== null && (
        <QnAModal
          title="QnA 상세"
          open
          id={selectedQnAId}
          onCancel={() => setSelectQnAId(null)}
          footer={false}
        />
      )}
    </main>
  );
};

export default Page;
