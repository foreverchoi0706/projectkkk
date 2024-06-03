import useStore from "@/hooks/useStore";
import { Layout, Form, FormProps, Input, Checkbox, Button, Flex } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "@/utils/cookie.ts";
import { ADMIN_ACCESS_TOKEN } from "@/utils/constants.ts";
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const Page: FC = () => {
  const navigate = useNavigate();
  const { setSignIn } = useStore(({ setSignIn }) => ({
    setSignIn,
  }));

  const onFinish: FormProps<FieldType>["onFinish"] = () => {
    setSignIn(true);
    setCookie(ADMIN_ACCESS_TOKEN, ADMIN_ACCESS_TOKEN);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Layout
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType> name="username" rules={[{ required: true }]}>
          <Input placeholder="username" />
        </Form.Item>

        <Form.Item<FieldType> name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="password" />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Flex gap="small">
            <Button style={{ flexGrow: "1" }} type="primary" htmlType="submit">
              로그인
            </Button>
            <Button
              style={{ flexGrow: "1" }}
              htmlType="button"
              onClick={() => navigate("/signUp")}
            >
              회원가입
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Page;
