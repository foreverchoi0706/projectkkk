"use client";
import { Layout, Form, FormProps, Input, Checkbox, Button } from "antd";
import { FC } from "react";

import useStore from "@/app/_hooks/useStore";
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const SignIn: FC = () => {
  const { setSignIn } = useStore(({ setSignIn }) => ({
    setSignIn,
  }));

  const onFinish: FormProps<FieldType>["onFinish"] = () => {
    setSignIn(true);
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
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ message: "Please input your username!", required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ message: "Please input your password!", required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            로그인
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default SignIn;
