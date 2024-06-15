import useStore from "@/hooks/useStore";
import { Layout, Form, FormProps, Input, Checkbox, Button, Flex } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCookie, getCookie, hasCookie, setCookie } from "@/utils/cookie.ts";
import { ADMIN_ACCESS_TOKEN, REMEMBER_ID } from "@/utils/constants.ts";
import { ISignInParams, IUserInfo } from "@/utils/types.ts";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/queryKeys";
import module from "@/pages/signIn/index.module.css";
import { AxiosResponse } from "axios";

const Page: FC = () => {
  const navigate = useNavigate();
  const { setSignIn } = useStore(({ setSignIn }) => ({
    setSignIn,
  }));

  const signInMutation = useMutation({
    mutationFn: (signInParams: ISignInParams) =>
      axiosInstance.post<ISignInParams, AxiosResponse<IUserInfo>>(
        "/loginToken/login",
        signInParams,
      ),
    onSuccess: ({ data: { accessToken } }) => {
      setSignIn(true);
      setCookie(ADMIN_ACCESS_TOKEN, accessToken);
    },
    onError: (e) => {
      alert(JSON.stringify(e));
    },
  });

  const handleFinish: FormProps<ISignInParams>["onFinish"] = (signInParams) => {
    if (signInParams.remember) {
      setCookie(REMEMBER_ID, signInParams.email);
    } else {
      deleteCookie(REMEMBER_ID);
    }
    signInMutation.mutate(signInParams);
  };

  return (
    <Layout className={module.layout}>
      <Form
        initialValues={{ email: getCookie(REMEMBER_ID) ?? "", remember: hasCookie(REMEMBER_ID) }}
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item<ISignInParams> name="email" rules={[{ required: true }]}>
          <Input placeholder="email" />
        </Form.Item>

        <Form.Item<ISignInParams> name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="password" />
        </Form.Item>

        <Form.Item<ISignInParams> name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Flex gap="middle">
            <Button className={module.button} type="primary" htmlType="submit">
              로그인
            </Button>
            <Button className={module.button} htmlType="button" onClick={() => navigate("/signUp")}>
              회원가입
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Page;
