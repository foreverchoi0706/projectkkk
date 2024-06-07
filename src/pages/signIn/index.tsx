import useStore from "@/hooks/useStore";
import { Layout, Form, FormProps, Input, Checkbox, Button, Flex } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "@/utils/cookie.ts";
import { ADMIN_ACCESS_TOKEN } from "@/utils/constants.ts";
import { ISignInParams } from "@/utils/types.ts";

const Page: FC = () => {
  const navigate = useNavigate();
  const { setSignIn } = useStore(({ setSignIn }) => ({
    setSignIn,
  }));

  const handleFinish: FormProps<ISignInParams>["onFinish"] = () => {
    setSignIn(true);
    setCookie(ADMIN_ACCESS_TOKEN, ADMIN_ACCESS_TOKEN);
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
      <Form initialValues={{ remember: true }} onFinish={handleFinish} autoComplete="off">
        <Form.Item<ISignInParams> name="username" rules={[{ required: true }]}>
          <Input placeholder="username" />
        </Form.Item>

        <Form.Item<ISignInParams> name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="password" />
        </Form.Item>

        <Form.Item<ISignInParams> name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Flex gap="small">
            <Button style={{ flexGrow: "1" }} type="primary" htmlType="submit">
              로그인
            </Button>
            <Button style={{ flexGrow: "1" }} htmlType="button" onClick={() => navigate("/signUp")}>
              회원가입
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Page;
