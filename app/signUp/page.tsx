"use client";
import { Button, Flex, Form, FormProps, Input, Layout, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";

import useAuth from "@/app/_hooks/useAuth";
import { SignUpParams } from "@/app/_utils/types";

const SignIn: FC = () => {
  const { signIn } = useAuth();
  const { back } = useRouter();

  const onFinish: FormProps<SignUpParams>["onFinish"] = (field) => {
    console.log(field);
    fetch("/api/members", {
      body: JSON.stringify(field),
      method: "POST",
    }).catch((e) => {
      console.log(e);
    });
    // signIn(JSON.stringify(field));
  };

  const onFinishFailed: FormProps<SignUpParams>["onFinishFailed"] = (
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
      <Typography.Title>회원가입</Typography.Title>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<SignUpParams>
          name="email"
          rules={[{ message: "필수입력 필드입니다", required: true }]}
        >
          <Input placeholder="아이디" />
        </Form.Item>

        <Form.Item<SignUpParams>
          name="name"
          rules={[{ message: "필수입력 필드입니다", required: true }]}
        >
          <Input placeholder="이름" />
        </Form.Item>

        <Form.Item<SignUpParams>
          name="phone"
          rules={[{ message: "필수입력 필드입니다", required: true }]}
        >
          <Input placeholder="전화번호" />
        </Form.Item>

        <Form.Item<SignUpParams>
          name="password"
          rules={[{ message: "필수입력 필드입니다", required: true }]}
        >
          <Input.Password placeholder="비밀번호" />
        </Form.Item>

        <Form.Item<SignUpParams>
          name="rePassword"
          rules={[{ message: "필수입력 필드입니다", required: true }]}
        >
          <Input.Password placeholder="비밀번호 확인" />
        </Form.Item>

        <Form.Item>
          <Flex gap="small">
            <Button style={{ flexGrow: "1" }} type="primary" htmlType="submit">
              회원가입
            </Button>
            <Button onClick={back} style={{ flexGrow: "1" }} htmlType="button">
              뒤로
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default SignIn;
