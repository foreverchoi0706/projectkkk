import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/utils/axiosInstance";
import {
  INVALID_FORMAT_EMAIL,
  PASSWORD_REGEXP,
  REQUIRED_EMAIL,
  REQUIRED_PASSWORD,
} from "@/utils/constants";
import supabaseClient from "@/utils/supabaseClient.ts";
import type { IAuth, IResponse, ISignInParams, TError } from "@/utils/types";
import type { User } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, type FormProps, Input, Typography } from "antd";
import type { AxiosResponse } from "axios";
import { type FC, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refOauthUser = useRef<User>(null);
  const [form] = Form.useForm<ISignInParams>();

  const signInMutation = useMutation<AxiosResponse<IResponse<IAuth>>, TError, ISignInParams>({
    mutationFn: (signInParams) => axiosInstance.post("/auth/login", signInParams),
    onSuccess: ({ data }) => login(data.result),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const oauthSignInMutation = useMutation<AxiosResponse<IResponse<IAuth>>, TError, string>({
    mutationFn: (email) => axiosInstance.post("/social/login", { email }),
    onSuccess: ({ data }) => login(data.result),
    onError: ({ responseMessage, status }) => {
      if (status !== 404) return alert(responseMessage);
      navigate("/signup", { state: refOauthUser.current });
    },
  });

  const onFinish: FormProps<ISignInParams>["onFinish"] = (signInParams) => {
    signInMutation.mutate(signInParams);
  };

  const onClickKakaoSignin = () => {
    supabaseClient.auth
      .signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: "http://localhost:5173/signin?oauth=true",
        },
      })
      .finally();
  };

  useEffect(() => {
    if (!searchParams.has("oauth")) return;
    supabaseClient.auth.getUser().then(({ data: { user } }) => {
      if (user === null || !user.email) return;
      refOauthUser.current = user;
      oauthSignInMutation.mutate(user.email);
    });
  }, []);

  useEffect(() => {
    form.setFieldValue("email", "center@center.com");
    form.setFieldValue("password", "Ccenter123456!");
  }, []);

  return (
    <main className="h-full flex flex-col items-center">
      <Typography.Title>로그인</Typography.Title>
      <Form<ISignInParams> className="w-full" form={form} autoComplete="off" onFinish={onFinish}>
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
              pattern: PASSWORD_REGEXP.PATTERN,
              message: PASSWORD_REGEXP.MESSAGE,
            },
          ]}
        >
          <Input.Password placeholder={REQUIRED_PASSWORD} />
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
          <button className="block my-0 mx-auto hover:brightness-95" onClick={onClickKakaoSignin}>
            <img
              width={183}
              height={45}
              alt="kakao_login_medium_narrow"
              src="/kakao_login_medium_narrow.png"
            />
          </button>
        </Form.Item>
      </Form>
    </main>
  );
};

export default Page;
