"use client";
import {
  Layout,
  Form,
  FormProps,
  Input,
  Checkbox,
  Button,
  Flex,
  Typography,
} from "antd";
import Link from "next/link";
import { FC } from "react";

import useAuth from "@/app/_hooks/useAuth";
type FieldType = {
  username: string;
  password: string;
};

const SignIn: FC = () => {
  const { signIn } = useAuth();

  const onFinish: FormProps<FieldType>["onFinish"] = (field) => {
    signIn(JSON.stringify(field));
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
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
      <Typography.Title>로그인</Typography.Title>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          name="username"
          rules={[{ message: "필수입력 필드입니다", required: true }]}
        >
          <Input placeholder="아이디" />
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          rules={[{ message: "비밀번호는 필수입니다", required: true }]}
        >
          <Input.Password placeholder="비밀번호" />
        </Form.Item>

        <Form.Item>
          <Flex gap="small">
            <Button style={{ flexGrow: "1" }} type="primary" htmlType="submit">
              로그인
            </Button>
            <Link href="/signUp" style={{ flexGrow: "1" }}>
              <Button style={{ width: "100%" }} htmlType="button">
                회원가입
              </Button>
            </Link>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default SignIn;
