"use client";
import { Button, Flex, Form, FormProps, Input, Layout, Typography } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "@/hooks/useStore.ts";
import { ISignUpParams, IUserInfo } from "@/utils/types.ts";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/queryKeys.ts";
import module from "@/pages/signUp/index.module.css";
import { AxiosResponse } from "axios";
import { setCookie } from "@/utils/cookie";
import { ADMIN_ACCESS_TOKEN } from "@/utils/constants";

const Page: FC = () => {
  const navigate = useNavigate();
  const { signIn, setSignIn } = useStore(({ signIn, setSignIn }) => ({ signIn, setSignIn }));
  const signInMutation = useMutation({
    mutationFn: (signUpParams: ISignUpParams) =>
      axiosInstance.post<ISignUpParams, AxiosResponse<IUserInfo>>("/member/Join", signUpParams),
    onSuccess: ({ data: { accessToken } }) => {
      console.log(signIn);
      setSignIn(true);
      setCookie(ADMIN_ACCESS_TOKEN, accessToken);
    },
  });

  const onFinish: FormProps<ISignUpParams>["onFinish"] = (signUpParams) => {
    signInMutation.mutate(signUpParams);
  };

  const onFinishFailed: FormProps<ISignUpParams>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
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
            <Button className={module.button} type="primary" htmlType="submit">
              회원가입
            </Button>
            <Button onClick={() => navigate(-1)} className={module.button} htmlType="button">
              뒤로
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Page;
