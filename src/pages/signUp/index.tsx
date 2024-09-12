"use client";
import useAuth from "@/hooks/useAuth.ts";
import {
  INVALILD_FORMAT_EMAIL,
  INVALILD_FORMAT_PASSWORD,
  INVALILD_FORMAT_PHONE,
  INVALILD_REPASWORD,
  REQUIRED_EMAIL,
  REQUIRED_NAME,
  REQUIRED_PASSWORD,
  REQUIRED_PHONE,
} from "@/utils/constants";
import { axiosInstance } from "@/utils/queryKeys.ts";
import { IResponse, ISignUpParams, IUserInfo, TError } from "@/utils/types.ts";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, FormProps, Input, Layout, Typography } from "antd";
import { AxiosResponse } from "axios";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const signUpMutation = useMutation<AxiosResponse<IResponse<IUserInfo>>, TError, ISignUpParams>({
    mutationFn: (signUpParams: ISignUpParams) => axiosInstance.post("/member/join", signUpParams),
    onSuccess: ({ data }) => login(data.result),
    onError: ({ responseMessage }) => alert(responseMessage),
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
      <Form onFinish={onFinish} autoComplete="off">
        <Form.Item<ISignUpParams>
          name="email"
          rules={[
            { required: true, message: REQUIRED_EMAIL },
            {
              type: "email",
              message: INVALILD_FORMAT_EMAIL,
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
              pattern: /^01[0-9][0-9]{8,9}$/,
              message: INVALILD_FORMAT_PHONE,
            },
          ]}
        >
          <Input type="number" placeholder={REQUIRED_PHONE} />
        </Form.Item>

        <Form.Item<ISignUpParams>
          name="password"
          rules={[
            { required: true, message: REQUIRED_PASSWORD },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
              message: INVALILD_FORMAT_PASSWORD,
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
              pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
              message: INVALILD_FORMAT_PASSWORD,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) return Promise.resolve();
                return Promise.reject(INVALILD_REPASWORD);
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
