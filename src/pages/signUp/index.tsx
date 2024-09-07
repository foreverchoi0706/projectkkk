"use client";
import useAuth from "@/hooks/useAuth.ts";
import { axiosInstance } from "@/utils/queryKeys.ts";
import { IResponse, ISignUpParams, IUserInfo } from "@/utils/types.ts";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, FormProps, Input, Layout, Typography } from "antd";
import { AxiosError, AxiosResponse } from "axios";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const signUpMutation = useMutation({
    mutationFn: (signUpParams: ISignUpParams) =>
      axiosInstance.post<ISignUpParams, AxiosResponse<IUserInfo>>("/member/join", signUpParams),
    onSuccess: ({ data }) => login(data),
    onError: ({ response }: AxiosError<IResponse>) => alert(JSON.stringify(response?.data.result)),
  });

  const onFinish: FormProps<ISignUpParams>["onFinish"] = (signUpParams) => {
    signUpMutation.mutate(signUpParams);
  };

  return (
    <Layout
      style={{
        alignItems: "center",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Typography.Title>회원가입</Typography.Title>
      <Form name="basic" onFinish={onFinish} autoComplete="off">
        <Form.Item<ISignUpParams> name="email" rules={[{ required: true }]}>
          <Input placeholder="email" />
        </Form.Item>

        <Form.Item<ISignUpParams> name="name" rules={[{ required: true }]}>
          <Input placeholder="name" />
        </Form.Item>

        <Form.Item<ISignUpParams> name="phone" rules={[{ required: true }]}>
          <Input placeholder="phone" />
        </Form.Item>

        <Form.Item<ISignUpParams> name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="password" />
        </Form.Item>

        <Form.Item<ISignUpParams> name="rePassword" rules={[{ required: true }]}>
          <Input.Password placeholder="rePassword" />
        </Form.Item>

        <Form.Item>
          <Flex gap="middle">
            <Button
              disabled={signUpMutation.isPending}
              style={{ flexGrow: "1" }}
              type="primary"
              htmlType="submit"
            >
              회원가입
            </Button>
            <Button onClick={() => navigate(-1)} style={{ flexGrow: "1" }} htmlType="button">
              뒤로
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Page;
