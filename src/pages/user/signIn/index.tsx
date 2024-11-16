import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/utils/axiosInstance";
import {
  INVALID_FORMAT_EMAIL,
  INVALID_FORMAT_PASSWORD,
  REQUIRED_EMAIL,
  REQUIRED_PASSWORD,
} from "@/utils/constants";
import supabaseClient from "@/utils/supabaseClient.ts";
import { IAuth, IResponse, ISignInParams, TError } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, FormProps, Input, Typography } from "antd";
import { AxiosResponse } from "axios";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Page: FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm<ISignInParams>();

  const signInMutation = useMutation<AxiosResponse<IResponse<IAuth>>, TError, ISignInParams>({
    mutationFn: (signInParams) => axiosInstance.post("/auth/login", signInParams),
    onSuccess: ({ data }) => login(data.result),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const signInOauthMutation = useMutation<AxiosResponse<IResponse<IAuth>>, TError, string>({
    mutationFn: (email) => axiosInstance.post("/social/login", { email }),
    onSuccess: ({ data }) => login(data.result),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onFinish: FormProps<ISignInParams>["onFinish"] = (signInParams) => {
    signInMutation.mutate(signInParams);
  };

  const onClickKakaoSignin = () => {
    supabaseClient.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: "http://localhost:5173/signin",
      },
    });
  };

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data: { user } }) => {
      if (user === null) return;
      console.log(user);
      signInOauthMutation();
    });
  }, []);

  useEffect(() => {
    form.setFieldValue("email", "center@center.com");
    form.setFieldValue("password", "Ccenter123456!");
  }, []);

  return (
    <main className="h-full flex flex-col items-center">
      <Typography.Title>로그인</Typography.Title>
      <Form<ISignInParams> form={form} autoComplete="off" onFinish={onFinish}>
        <Form.Item<ISignInParams>
          name="email"
          rules={[
            { required: true, message: REQUIRED_EMAIL },
            {
              type: "email",
              message: INVALID_FORMAT_EMAIL,
            },
          ]}
        >
          <Input placeholder="email" />
        </Form.Item>

        <Form.Item<ISignInParams>
          name="password"
          rules={[
            { required: true, message: REQUIRED_PASSWORD },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
              message: INVALID_FORMAT_PASSWORD,
            },
          ]}
        >
          <Input.Password placeholder="password" />
        </Form.Item>
        <Form.Item>
          <Flex className="gap-4">
            <Button
              disabled={signInMutation.isPending}
              className="flex-grow"
              type="primary"
              htmlType="submit"
            >
              로그인
            </Button>
            <Button className="flex-grow" htmlType="button" onClick={() => navigate("/signup")}>
              회원가입
            </Button>
          </Flex>
        </Form.Item>
        <Form.Item>
          <img
            className="my-0 mx-auto cursor-pointer hover:brightness-95"
            width={183}
            height={45}
            alt="kakao_login_medium_narrow"
            src="/kakao_login_medium_narrow.png"
            onClick={onClickKakaoSignin}
          />
        </Form.Item>
      </Form>
    </main>
  );
};

export default Page;
