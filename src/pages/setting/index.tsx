import { FC, useEffect, useState } from "react";
import queryKeys, { axiosInstance } from "@/utils/queryKeys";
import { IMember, IResponse, ISignInParams, IUserInfo, TError } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Flex, Button, FormProps } from "antd";
import { AxiosResponse } from "axios";
import {
  INVALILD_FORMAT_EMAIL,
  REQUIRED_EMAIL,
  REQUIRED_NAME,
  REQUIRED_PASSWORD,
  REQUIRED_PHONE,
} from "@/utils/constants";

const Setting: FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<IMember>();
  const { data: member } = useQuery(queryKeys.members.detail());
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const updateMemberMutation = useMutation<unknown, TError, IMember>({
    mutationFn: (member) => axiosInstance.put("/member/UpdateMember", member),
    onSuccess: async () => {
      await Promise.allSettled([queryClient.invalidateQueries(queryKeys.members.detail())]);
      alert("멤버가 수정되었습니다");
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const memberVerifyMutation = useMutation<
    AxiosResponse<IResponse<IUserInfo>>,
    TError,
    Pick<ISignInParams, "password">
  >({
    mutationFn: ({ password }) => axiosInstance.post("/member/verify", { password }),
    onSuccess: () => setIsVerified(true),
  });

  const onFinishVerify: FormProps<Pick<ISignInParams, "password">>["onFinish"] = ({ password }) => {
    memberVerifyMutation.mutate({ password });
  };

  const onFinishUpdateMember: FormProps<IMember>["onFinish"] = (member) => {
    // memberVerifyMutation.mutate({ password });
    console.log(member);
  };

  useEffect(() => {
    return () => setIsVerified(false);
  }, []);

  if (isVerified && member)
    return (
      <Form<IMember> initialValues={member} form={form} onFinish={onFinishUpdateMember}>
        <Form.Item<IMember>
          name="name"
          rules={[
            {
              required: true,
              message: REQUIRED_NAME,
            },
          ]}
        >
          <Input placeholder="회원명" />
        </Form.Item>
        <Form.Item<IMember>
          name="phone"
          rules={[
            {
              required: true,
              message: REQUIRED_PHONE,
            },
          ]}
        >
          <Input type="number" placeholder="전화번호" />
        </Form.Item>
        <Form.Item<IMember>
          name="email"
          rules={[
            {
              required: true,
              message: REQUIRED_EMAIL,
            },
            {
              type: "email",
              message: INVALILD_FORMAT_EMAIL,
            },
          ]}
        >
          <Input placeholder="이메일" />
        </Form.Item>
        <Form.Item>
          <Button disabled={updateMemberMutation.isPending} htmlType="submit" type="primary">
            수정
          </Button>
        </Form.Item>
      </Form>
    );

  return (
    <Form onFinish={onFinishVerify}>
      <Form.Item<Pick<ISignInParams, "password">>
        name="password"
        rules={[{ required: true, message: REQUIRED_PASSWORD }]}
      >
        <Input.Password placeholder="password" />
      </Form.Item>
      <Form.Item>
        <Flex gap="middle">
          <Button
            disabled={memberVerifyMutation.isPending}
            style={{ flexGrow: "1" }}
            type="primary"
            htmlType="submit"
          >
            인증
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default Setting;
