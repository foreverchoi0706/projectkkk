import admin from "@/queryKeys/admin";
import axiosInstance from "@/utils/axiosInstance";
import { ANSWER_STATUS, DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import { IQnAWaiting, TError, TAnswer } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Form, FormProps, Modal, Spin, Table, TableProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [answerForm] = Form.useForm<TAnswer>();
  const [selectedQnAId, setSelectedQnAId] = useState<number | null>();
  const isOpen = selectedQnAId !== undefined;

  const { data: qnaPages } = useQuery(admin.qnas.pages(searchParams.toString()));

  const answerQnAMutation = useMutation<unknown, TError, TAnswer>({
    mutationFn: ({ answer }) =>
      axiosInstance.post(`/admin/qna/answer?qnAId=${selectedQnAId}&answer=${answer}`),
    onSuccess: () => {
      alert("QnA가 등록되었습니다");
      queryClient
        .invalidateQueries(admin.qnas.pages(searchParams.toString()))
        .then(() => setSelectedQnAId(undefined));
    },
  });

  const updateQnAMutation = useMutation<unknown, TError, TAnswer>({
    mutationFn: ({ answer }) =>
      axiosInstance.post(`/admin/qna/update?qnAId=${selectedQnAId}&answer=${answer}`),
    onSuccess: () => {
      alert("QnA가 수정되었습니다");
      queryClient
        .invalidateQueries(admin.qnas.pages(searchParams.toString()))
        .then(() => setSelectedQnAId(undefined));
    },
  });

  const deleteQnAMutation = useMutation<unknown, TError, number>({
    mutationFn: (id) => axiosInstance.delete(`/admin/qna/delete?qnAId=${id}`),
    onSuccess: () => {
      alert("QnA가 삭제되었습니다");
      queryClient.invalidateQueries(admin.qnas.pages(searchParams.toString()));
    },
  });

  const onFinishAnswerQna: FormProps<TAnswer>["onFinish"] = (answer) => {
    const qnA = qnaPages?.content.find(({ id }) => id === selectedQnAId);
    if (!qnA) return;
    const mutation =
      qnA.answerStatus === ANSWER_STATUS.WAITING ? answerQnAMutation : updateQnAMutation;
    mutation.mutate(answer);
  };

  if (!qnaPages) return <Spin />;
  const columns: TableProps<IQnAWaiting>["columns"] = [
    {
      align: "center",
      dataIndex: "id",
      key: "id",
      title: "id",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "qnAType",
      key: "qnAType",
      title: "qnAType",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "subject",
      key: "subject",
      title: "subject",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "productNum",
      key: "productNum",
      title: "productNum",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "orderNum",
      key: "orderNum",
      title: "orderNum",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "description",
      key: "description",
      title: "description",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "memberEmail",
      key: "memberEmail",
      title: "memberEmail",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "createAt",
      key: "createAt",
      title: "createAt",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answer",
      key: "answer",
      title: "answer",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answerDate",
      key: "answerDate",
      title: "answerDate",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answererEmail",
      key: "answererEmail",
      title: "answererEmail",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answerStatus",
      key: "answerStatus",
      title: "answerStatus",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "button",
      key: "button",
      title: "답변하기",
      onCell: ({ id }) => ({
        onClick: () => setSelectedQnAId(id),
      }),
      render: () => <Button>답변하기</Button>,
    },
    {
      align: "center",
      dataIndex: "button",
      key: "button",
      title: "삭제",
      onCell: ({ id }) => ({
        onClick: () => {
          if (!window.confirm("해당 QnA를 삭제하시겠습니까?")) return;
          deleteQnAMutation.mutate(id);
        },
      }),
      render: () => <Button>삭제</Button>,
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
          onChange: (page) => navigate(`/admin/qnas?page=${page}`, { replace: true }),
          pageSize: DEFAULT_LIST_PAGE_SIZE,
          current: qnaPages.page + 1,
          total: qnaPages.totalCount,
          showSizeChanger: false,
        }}
      />
      {isOpen && (
        <Modal
          title="QnA 답변"
          open={isOpen}
          footer={null}
          okButtonProps={{}}
          onCancel={() => setSelectedQnAId(undefined)}
        >
          <Form<TAnswer> onFinish={onFinishAnswerQna} form={answerForm}>
            <Form.Item<TAnswer>
              name="answer"
              rules={[
                {
                  required: true,
                  message: "답변을 입력해주세요",
                },
              ]}
            >
              <TextArea />
            </Form.Item>
            <Form.Item<TAnswer>>
              <Flex className="gap-4">
                <Button
                  disabled={answerQnAMutation.isPending || updateQnAMutation.isPending}
                  className="flex-grow"
                  htmlType="submit"
                  type="primary"
                >
                  답변
                </Button>
                <Button className="flex-grow" onClick={() => setSelectedQnAId(undefined)}>
                  취소
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Flex>
  );
};

export default Page;
