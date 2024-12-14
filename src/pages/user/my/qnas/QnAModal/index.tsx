import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Flex, Modal, type ModalProps, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { FC } from "react";

const QnAModal: FC<ModalProps & { id: number }> = ({ id, ...rest }) => {
  const { data: qna } = useQuery(user.qnas.detail(id));

  if (qna === undefined) return null;

  return (
    <Modal {...rest}>
      <Flex className="flex-col gap-4">
        <Typography className="text-center font-bold text-2xl">{qna.subject}</Typography>
        <TextArea className="resize-none" readOnly defaultValue={qna.description} />
        {qna.answerStatus === "WAITING" ? (
          <Flex className="flex-col justify-center items-center gap-8 p-8">
            <Typography className="text-center font-bold text-2xl">
              아직 관리자가 답변을 달지 않았어요 조금만 더 기다려주세요
            </Typography>
          </Flex>
        ) : (
          <Flex>
            <Typography>{qna.answerDate}</Typography>
            <TextArea readOnly />
          </Flex>
        )}
      </Flex>
    </Modal>
  );
};

export default QnAModal;
