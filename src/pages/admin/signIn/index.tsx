import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/utils/axiosInstance";
import {
  INVALID_FORMAT_EMAIL,
  PASSWORD_REGEXP,
  REQUIRED_EMAIL,
  REQUIRED_PASSWORD,
} from "@/utils/constants";
import type { IAuth, IResponse, ISignInParams, TError } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, type FormProps, Input, Layout, Typography } from "antd";
import type { AxiosResponse } from "axios";
import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const signInMutation = useMutation<AxiosResponse<IResponse<IAuth>>, TError, ISignInParams>({
    mutationFn: (signInParams) => axiosInstance.post("/admin/auth/login", signInParams),
    onSuccess: ({ data }) => login(data.result),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onFinish: FormProps<ISignInParams>["onFinish"] = (signInParams) => {
    signInMutation.mutate(signInParams);
  };

  return (
    <Layout className="flex items-center justify-center h-screen">
      <Typography.Title>로그인</Typography.Title>
      <Form onFinish={onFinish}>
        <Form.Item<ISignInParams>
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

        <Form.Item<ISignInParams>
          name="password"
          rules={[
            { required: true, message: REQUIRED_PASSWORD },
            {
              pattern: PASSWORD_REGEXP.PATTERN,
              message: PASSWORD_REGEXP.MESSAGE,
            },
          ]}
        >
          <Input.Password placeholder="password" />
        </Form.Item>
        <Form.Item>
          <Flex gap="middle">
            <Button
              disabled={signInMutation.isPending}
              className="flex-grow"
              type="primary"
              htmlType="submit"
            >
              로그인
            </Button>
            <Button
              className="flex-grow"
              htmlType="button"
              onClick={() => navigate("/admin/signup")}
            >
              회원가입
            </Button>
          </Flex>
        </Form.Item>
        <Form.Item>
          <Link to="/admin/reset-password">
            <Button className="w-full">비밀번호 재설정</Button>
          </Link>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Page;
