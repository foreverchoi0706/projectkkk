import admin from "@/queryKeys/admin.ts";
import user from "@/queryKeys/user";
import axiosInstance from "@/utils/axiosInstance.ts";
import { ANSWER_STATUS } from "@/utils/constants.ts";
import type { TAnswer, TError } from "@/utils/types.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Form, type FormProps, Modal, type ModalProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Dispatch, FC, SetStateAction, useEffect } from "react";

interface IProps {
  id: number;
  setSelectedQnAId: Dispatch<SetStateAction<number | null>>;
}

const QnAModal: FC<ModalProps & IProps> = ({ id, setSelectedQnAId, ...rest }) => {
  const queryClient = useQueryClient();
  const [answerForm] = Form.useForm<TAnswer>();
  const { data: qna } = useQuery(user.qnas.detail(id));

  const answerQnAMutation = useMutation<unknown, TError, TAnswer>({
    mutationFn: ({ answer }) =>
      axiosInstance.post(`/admin/qna/answer?qnAId=${id}&answer=${answer}`),
    onSuccess: () => {
      alert("답변이 등록되었습니다");
      Promise.all([
        queryClient.invalidateQueries(admin.qnas.pages(id.toString())),
        queryClient.invalidateQueries(user.qnas.detail(id)),
      ]).then(() => setSelectedQnAId(null));
    },
  });

  const updateQnAMutation = useMutation<unknown, TError, TAnswer>({
    mutationFn: ({ answer }) => axiosInstance.put(`/admin/qna/update?qnAId=${id}&answer=${answer}`),
    onSuccess: () => {
      alert("답변이 수정되었습니다");
      Promise.all([
        queryClient.invalidateQueries(admin.qnas.pages(id.toString())),
        queryClient.invalidateQueries(user.qnas.detail(id)),
      ]).then(() => setSelectedQnAId(null));
    },
  });

  const onFinishAnswerQna: FormProps<TAnswer>["onFinish"] = (answer) => {
    if (!qna) return;
    const mutation =
      qna.answerStatus === ANSWER_STATUS.WAITING ? answerQnAMutation : updateQnAMutation;
    mutation.mutate(answer);
  };

  useEffect(() => {
    if (!qna) return;
    answerForm.setFieldValue("answer", qna.answer);
  }, [qna]);

  if (qna === undefined) return null;

  return (
    <Modal open {...rest}>
      <Form<TAnswer> onFinish={onFinishAnswerQna} form={answerForm}>
        <Form.Item<TAnswer>>
          <TextArea readOnly defaultValue={qna.description} />
        </Form.Item>
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
            {qna.answerStatus !== ANSWER_STATUS.DELETED && (
              <Button
                disabled={answerQnAMutation.isPending || updateQnAMutation.isPending}
                className="flex-grow"
                htmlType="submit"
                type="primary"
              >
                {qna.answerStatus === ANSWER_STATUS.WAITING ? "답변하기" : "수정하기"}
              </Button>
            )}

            <Button
              className="flex-grow"
              onClick={() => {
                answerForm.resetFields();
                setSelectedQnAId(null);
              }}
            >
              취소
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QnAModal;
