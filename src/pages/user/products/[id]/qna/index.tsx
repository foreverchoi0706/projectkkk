import QnAModal from "@/pages/user/my/qnas/QnAModal";
import axiosInstance from "@/utils/axiosInstance";
import { IProductDetail, IQnaParams, TError } from "@/utils/types.ts";
import { useMutation } from "@tanstack/react-query";
import { Button, Drawer, Flex, Form, FormProps, Input, Select, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC, useState } from "react";

const Page: FC<Pick<IProductDetail, "qnADetailResponses">> = ({ qnADetailResponses }) => {
  const [form] = Form.useForm<IQnaParams>();
  const [isOpenQnaDrawer, setIsOpenQnaDrawer] = useState<boolean>(false);
  const [selectedQnAId, setSelectQnAId] = useState<number | null>(null);

  const addQnaMutation = useMutation<unknown, TError, IQnaParams>({
    mutationFn: (qnaParams: IQnaParams) => axiosInstance.post("/qna/join", qnaParams),
    onSuccess: async () => alert("QnA가 등록되었습니다"),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onClickOpenAddQnaDrawer = () => {
    setIsOpenQnaDrawer(true);
  };

  const onFinish: FormProps<IQnaParams>["onFinish"] = (qnaParams) => {
    addQnaMutation.mutate(qnaParams);
  };

  return (
    <section>
      {qnADetailResponses.length > 0 ? (
        qnADetailResponses.map(() => (
          <Flex className="flex flex-col gap-4">
            {qnADetailResponses.map(({ id, createAt, subject, answerStatus, qnAType }) => (
              <Flex
                key={id}
                className="cursor-pointer flex-col gap-4 p-4 border border-gray-200 rounded"
                onClick={() => setSelectQnAId(id)}
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
            ))}
          </Flex>
        ))
      ) : (
        <Flex className="flex-col gap-4 flex-grow justify-center items-center my-4">
          <Typography className="text-5xl">😥</Typography>
          <Typography className="text-2xl">아직 작성된 QnA가 없습니다</Typography>
        </Flex>
      )}
      <Flex className="flex-col gap-4 my-4">
        <Typography className="text-center text-5xl">🛍</Typography>
        <Typography className="text-center text-lg font-bold">
          상품에 대해 궁금한 것이 있으신가요?
        </Typography>
        <Typography className="text-center">
          상품 관련 문의는 판매자가 상세히 답변드립니다.
        </Typography>
        <Typography className="text-center">
          (답변은 '앱의 마이페이지 {">"} 문의 내역' 에서 확인하실 수 있습니다.)
        </Typography>
        <Button type="primary" onClick={onClickOpenAddQnaDrawer}>
          QNA 등록
        </Button>
      </Flex>

      <Drawer
        closeIcon={false}
        styles={{
          wrapper: {
            boxShadow: "none",
            height: "fit-content",
          },
          content: {
            borderRadius: "8px 8px 0 0",
            maxWidth: "600px",
            width: "100%",
            margin: "0 auto",
          },
        }}
        placement="bottom"
        footer={false}
        onClose={() => setIsOpenQnaDrawer(false)}
        open={isOpenQnaDrawer}
      >
        <Form<IQnaParams> form={form} autoComplete="off" onFinish={onFinish}>
          <Form.Item<IQnaParams>
            name="qnAType"
            rules={[{ required: true, message: "QnA 종류를 선택해주세요" }]}
          >
            <Select<IQnaParams> placeholder="QnA 종류를 선택해주세요">
              <Select.Option value="SHIPPING">배송</Select.Option>
              <Select.Option value="ORDER">주문</Select.Option>
              <Select.Option value="REFUND">환불</Select.Option>
              <Select.Option value="OTHER">기타</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item<IQnaParams>
            name="subject"
            rules={[{ required: true, message: "제목을 입력해주세요" }]}
          >
            <Input placeholder="제목을 입력해주세요" />
          </Form.Item>
          <Form.Item<IQnaParams>
            name="description"
            rules={[{ required: true, message: "내용을 입력해주세요" }]}
          >
            <TextArea placeholder="내용을 입력해주세요" />
          </Form.Item>
          <Form.Item<IQnaParams>>
            <Flex className="gap-4">
              <Button className="flex-grow" type="primary" htmlType="submit">
                등록
              </Button>
              <Button
                className="flex-grow"
                onClick={() => setIsOpenQnaDrawer(false)}
                htmlType="button"
              >
                취소
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Drawer>
      {selectedQnAId !== null && (
        <QnAModal
          title="QnA 상세"
          open
          id={selectedQnAId}
          onCancel={() => setSelectQnAId(null)}
          footer={false}
        />
      )}
    </section>
  );
};

export default Page;
