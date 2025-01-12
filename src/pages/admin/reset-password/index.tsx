import axiosInstance from "@/utils/axiosInstance.ts";
import {
  INVALID_FORMAT_EMAIL,
  INVALID_RE_PASSWORD,
  PASSWORD_REGEXP,
  REQUIRED_EMAIL,
  REQUIRED_PASSWORD,
} from "@/utils/constants.ts";
import {
  ISignUpParams,
  TError,
  TRequestResetPasswordTokenParams,
  TResetPasswordParams,
} from "@/utils/types.ts";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Layout, Typography } from "antd";
import { FC } from "react";

const Page: FC = () => {
  const requestResetPasswordTokenMutation = useMutation<
    unknown,
    TError,
    TRequestResetPasswordTokenParams
  >({
    mutationFn: (requestResetPasswordTokenParams) =>
      axiosInstance.post("/member/reset-password-request", requestResetPasswordTokenParams),
    onSuccess: () => alert("비밀번호 재설정 링크가 이메일로 전송되었습니다"),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const resetPasswordMutation = useMutation<unknown, TError, TResetPasswordParams>({
    mutationFn: (resetPasswordParams) =>
      axiosInstance.post("/member/reset_password", resetPasswordParams),
    onSuccess: () => alert("비밀번호가 재설정되었습니다"),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  if (requestResetPasswordTokenMutation.isSuccess) {
    return (
      <Layout className="flex items-center justify-center h-screen">
        <Typography.Title>비밀번호 재설정</Typography.Title>
        <Form onFinish={resetPasswordMutation.mutate} disabled={resetPasswordMutation.isPending}>
          <Form.Item<ISignUpParams>
            name="password"
            rules={[
              { required: true, message: REQUIRED_PASSWORD },
              {
                pattern: PASSWORD_REGEXP.PATTERN,
                message: PASSWORD_REGEXP.MESSAGE,
              },
            ]}
          >
            <Input.Password placeholder={REQUIRED_PASSWORD} />
          </Form.Item>
          <Form.Item<ISignUpParams>
            name="passwordConfirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: REQUIRED_PASSWORD },
              {
                pattern: PASSWORD_REGEXP.PATTERN,
                message: PASSWORD_REGEXP.MESSAGE,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) return Promise.resolve();
                  return Promise.reject(INVALID_RE_PASSWORD);
                },
              }),
            ]}
          >
            <Input.Password placeholder={REQUIRED_PASSWORD} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              재설정
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    );
  }

  return (
    <Layout className="flex items-center justify-center h-screen">
      <Typography.Title>비밀번호 재설정</Typography.Title>
      <Form
        onFinish={requestResetPasswordTokenMutation.mutate}
        disabled={requestResetPasswordTokenMutation.isPending}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: REQUIRED_EMAIL },
            {
              type: "email",
              message: INVALID_FORMAT_EMAIL,
            },
          ]}
        >
          <Input placeholder="email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            확인
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Page;
