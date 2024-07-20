import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Button, Form, FormProps, Input, Modal, ModalProps } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IMember, IResponse } from "@/utils/types";
import queryKeys, { axiosInstance } from "@/utils/queryKeys";
import { AxiosError } from "axios";

interface IProps {
  memberId: number;
  setSelectedMemberId: Dispatch<SetStateAction<number | undefined>>;
  queryString: string;
}

const UpsertModal: FC<IProps & ModalProps> = ({
  memberId,
  setSelectedMemberId,
  queryString,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<IMember>();
  const { data: member } = useQuery(queryKeys.members.detail(memberId));

  const updateMemberMutation = useMutation({
    mutationFn: (member: IMember) => axiosInstance.put("/member/UpdateMember", member),
    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries(queryKeys.members.all(queryString)),
        queryClient.invalidateQueries(queryKeys.members.detail(memberId)),
      ]);
      alert("멤버가 수정되었습니다");
      setSelectedMemberId(undefined);
    },
    onError: ({ response }: AxiosError<IResponse>) => alert(JSON.stringify(response?.data.result)),
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (memberId: number) =>
      axiosInstance.delete(`/member/DeleteMember?memberId=${memberId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeys.members.all(queryString));
      alert("멤버가 삭제되었습니다");
      setSelectedMemberId(undefined);
    },
    onError: ({ response }: AxiosError<IResponse>) => alert(JSON.stringify(response?.data.result)),
  });

  const onFinish: FormProps<IMember>["onFinish"] = (product) => {
    updateMemberMutation.mutate(product);
  };

  useEffect(() => {
    if (member) form.setFieldsValue(member);
  }, [member]);

  return (
    <Modal {...rest} title={"멤버 상세"}>
      <Form initialValues={member} form={form} onFinish={onFinish}>
        <Form.Item<IMember> name="id">
          <Input placeholder="회원번호" readOnly />
        </Form.Item>
        <Form.Item<IMember> name="name">
          <Input placeholder="회원명" />
        </Form.Item>
        <Form.Item<IMember> name="phone">
          <Input placeholder="전화번호" />
        </Form.Item>
        <Form.Item<IMember> name="email">
          <Input placeholder="이메일" />
        </Form.Item>
        <Form.Item>
          <Button disabled={updateMemberMutation.isPending} htmlType="submit" type="primary">
            수정
          </Button>
          <Button
            disabled={deleteMemberMutation.isPending}
            onClick={() => deleteMemberMutation.mutate(memberId)}
            htmlType="button"
            type="link"
          >
            멤버 삭제
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpsertModal;
