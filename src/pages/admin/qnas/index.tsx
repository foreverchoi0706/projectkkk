import QnAModal from "@/pages/admin/qnas/QnAModal";
import admin from "@/queryKeys/admin";
import axiosInstance from "@/utils/axiosInstance";
import { ANSWER_STATUS, DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import type { IQnAWaiting, TError } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Spin, Table, type TableProps } from "antd";
import { type FC, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [selectedQnAId, setSelectedQnAId] = useState<number | null>(null);

  const { data: qnaPages } = useQuery(admin.qnas.pages(searchParams.toString()));

  const deleteQnAMutation = useMutation<unknown, TError, number>({
    mutationFn: (id) => axiosInstance.delete(`/admin/qna/delete?qnAId=${id}`),
    onSuccess: () => {
      alert("QnA가 삭제되었습니다");
      queryClient.invalidateQueries(admin.qnas.pages(searchParams.toString()));
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  if (!qnaPages) return <Spin />;
  const columns: TableProps<IQnAWaiting>["columns"] = [
    {
      align: "center",
      dataIndex: "id",
      title: "id",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "qnAType",
      title: "qnAType",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "subject",
      title: "subject",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "productNum",
      title: "productNum",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "orderNum",
      title: "orderNum",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "description",
      title: "description",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "memberEmail",
      title: "memberEmail",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "createAt",
      title: "createAt",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answer",
      title: "answer",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answerDate",
      title: "answerDate",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answererEmail",
      title: "answererEmail",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answerStatus",
      title: "answerStatus",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      title: "상세",
      render: (_, { id }) => <Button onClick={() => setSelectedQnAId(id)}>상세</Button>,
    },
    {
      align: "center",
      title: "삭제",
      render: (_, { answerStatus, id }) => (
        <Button
          onClick={() => {
            if (!window.confirm("해당 QnA를 삭제하시겠습니까?")) return;
            deleteQnAMutation.mutate(id);
          }}
          disabled={answerStatus === ANSWER_STATUS.DELETED}
        >
          삭제
        </Button>
      ),
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Table<IQnAWaiting>
        scroll={{ y: 550 }}
        title={() => "QnA관리"}
        rowKey={({ id }) => id}
        columns={columns}
        locale={{ emptyText: "검색결과가 없습니다" }}
        dataSource={qnaPages.content}
        pagination={{
          onChange: (page) => navigate(`${pathname}?page=${page}`, { replace: true }),
          pageSize: DEFAULT_LIST_PAGE_SIZE,
          current: qnaPages.page + 1,
          total: qnaPages.totalCount,
          showSizeChanger: false,
        }}
      />
      {selectedQnAId !== null && (
        <QnAModal
          id={selectedQnAId}
          setSelectedQnAId={setSelectedQnAId}
          title="QnA 답변"
          footer={null}
          onCancel={() => setSelectedQnAId(null)}
        />
      )}
    </Flex>
  );
};

export default Page;
