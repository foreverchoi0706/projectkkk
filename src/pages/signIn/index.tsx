import useAuth from "@/hooks/useAuth.ts";
import { INVALILD_FORMAT_EMAIL, INVALILD_FORMAT_PASSWORD, REQUIRED_EMAIL, REQUIRED_PASSWORD } from "@/utils/constants";
import { axiosInstance } from "@/utils/queryKeys";
import { TError, IResponse, ISignInParams, IUserInfo } from "@/utils/types.ts";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, FormProps, Input, Layout, Typography } from "antd";
import { AxiosResponse } from "axios";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const signInMutation = useMutation<
    AxiosResponse<IResponse<IUserInfo>>,
    TError,
    ISignInParams
  >({
    mutationFn: (signInParams) => axiosInstance.post("/auth/login", signInParams),
    onSuccess: ({ data }) => login(data.result),
    onError: ({ responseMessage }) => alert(responseMessage)
  });

  const handleFinish: FormProps<ISignInParams>["onFinish"] = (signInParams) => {
    signInMutation.mutate(signInParams);
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
      <Form onFinish={handleFinish}>
        <Form.Item<ISignInParams> name="email" rules={[{ required: true, message: REQUIRED_EMAIL }, {
          type: 'email',
          message: INVALILD_FORMAT_EMAIL,
        }]}>
          <Input placeholder="email" />
        </Form.Item>

        <Form.Item<ISignInParams> name="password" rules={[{ required: true, message: REQUIRED_PASSWORD }, {
          pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
          message: INVALILD_FORMAT_PASSWORD,
        }]}>
          <Input.Password placeholder="password" />
        </Form.Item>

        <Form.Item>
          <Flex gap="middle">
            <Button
              disabled={signInMutation.isPending}
              style={{ flexGrow: "1" }}
              type="primary"
              htmlType="submit"
            >
              로그인
            </Button>
            <Button style={{ flexGrow: "1" }} htmlType="button" onClick={() => navigate("/signup")}>
              회원가입
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Layout >
  );
};

export default Page;
