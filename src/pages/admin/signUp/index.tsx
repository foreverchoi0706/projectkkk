"use client";
import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/utils/axiosInstance";
import {
  INVALID_FORMAT_EMAIL,
  INVALID_RE_PASSWORD,
  PASSWORD_REGEXP,
  PHONE_REGEXP,
  REQUIRED_EMAIL,
  REQUIRED_NAME,
  REQUIRED_PASSWORD,
  REQUIRED_PHONE,
} from "@/utils/constants";
import type { IAuth, IResponse, ISignUpParams, TError } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, type FormProps, Input, Layout, Typography } from "antd";
import type { AxiosResponse } from "axios";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

const Page: FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const signUpMutation = useMutation<AxiosResponse<IResponse<IAuth>>, TError, ISignUpParams>({
    mutationFn: (signUpParams: ISignUpParams) =>
      axiosInstance.post("/admin/member/join", signUpParams),
    onSuccess: ({ data }) => login(data.result),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onFinish: FormProps<ISignUpParams>["onFinish"] = (signUpParams) => {
    signUpMutation.mutate(signUpParams);
  };

  return (
    <Layout className="flex items-center justify-center h-screen">
      <Typography.Title>회원가입</Typography.Title>
      <Form onFinish={onFinish} autoComplete="off">
        <Form.Item<ISignUpParams>
          name="email"
          rules={[
            { required: true, message: REQUIRED_EMAIL },
            {
              type: "email",
              message: INVALID_FORMAT_EMAIL,
            },
          ]}
        >
          <Input placeholder={REQUIRED_EMAIL} />
        </Form.Item>

        <Form.Item<ISignUpParams> name="name" rules={[{ required: true, message: REQUIRED_NAME }]}>
          <Input placeholder={REQUIRED_NAME} />
        </Form.Item>

        <Form.Item<ISignUpParams>
          name="phone"
          rules={[
            { required: true, message: REQUIRED_PHONE },
            {
              pattern: PHONE_REGEXP.PATTERN,
              message: PHONE_REGEXP.MESSAGE,
            },
          ]}
        >
          <Input maxLength={11} placeholder={REQUIRED_PHONE} />
        </Form.Item>

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
          <Flex gap="middle">
            <Button
              disabled={signUpMutation.isPending}
              className="flex-grow"
              type="primary"
              htmlType="submit"
            >
              회원가입
            </Button>
            <Button
              onClick={() => navigate("/admin/signin")}
              className="flex-grow"
              htmlType="button"
            >
              뒤로
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Page;
