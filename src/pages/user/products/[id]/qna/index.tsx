import { axiosInstance } from "@/queryKeys/admin.ts";
import { IQnaParams, TError } from "@/utils/types.ts";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, FormProps, Input, Modal, Select, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { FC, useState } from "react";

const Page: FC = () => {
  const [form] = useForm<IQnaParams>();

  const [isOpenQnaModal, setIsOpenQnaModal] = useState<boolean>(false);

  const addQnaMutation = useMutation<unknown, TError, IQnaParams>({
    mutationFn: (qnaParams: IQnaParams) => axiosInstance.post("/qna/join", qnaParams),
    onSuccess: async () => alert("Qna가 등록되었습니다"),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onClickOpenAddQnaModal = () => {
    setIsOpenQnaModal(true);
  };

  const onFinish: FormProps<IQnaParams>["onFinish"] = (qnaParams) => {
    addQnaMutation.mutate(qnaParams);
  };

  return (
    <section>
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
        <Button type="primary" onClick={onClickOpenAddQnaModal}>
          QNA 등록
        </Button>
      </Flex>

      <Modal
        title="QnA 등록"
        okText="등록"
        footer={false}
        cancelText="취소"
        onCancel={() => setIsOpenQnaModal(false)}
        open={isOpenQnaModal}
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
              <Button type="primary" htmlType="submit">
                등록
              </Button>
              <Button onClick={() => setIsOpenQnaModal(false)} htmlType="button">
                취소
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default Page;
