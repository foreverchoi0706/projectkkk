"use client";
import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/utils/axiosInstance";
import {
  INVALID_FORMAT_EMAIL,
  INVALID_RE_PASSWORD,
  PASSWORD_REGEXP,
  PHONE_REGEXP,
  REQUIRED_EMAIL,
  REQUIRED_NAME,
  REQUIRED_PASSWORD,
  REQUIRED_PHONE,
} from "@/utils/constants";
import { IAuth, IResponse, ISignUpParams, TError } from "@/utils/types";
import { User } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { Button, DatePicker, Flex, Form, FormProps, Input, Radio, Typography } from "antd";
import { AxiosResponse } from "axios";
import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Page: FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state }: { state: User } = useLocation();
  const [signUpForm] = Form.useForm<ISignUpParams>();

  const signUpMutation = useMutation<AxiosResponse<IResponse<IAuth>>, TError, ISignUpParams>({
    mutationFn: (signUpParams: ISignUpParams) => axiosInstance.post("/member/join", signUpParams),
    onSuccess: ({ data }) => login(data.result),
    onError: ({ result }) => alert(result.errorMessage),
  });

  const oauthSignUpMutation = useMutation<AxiosResponse<IResponse<IAuth>>, TError, ISignUpParams>({
    mutationFn: (signUpParams: ISignUpParams) => axiosInstance.post("/social/join", signUpParams),
    onSuccess: ({ data }) => login(data.result),
    onError: ({ result }) => alert(result.errorMessage),
  });

  const onFinish: FormProps<ISignUpParams>["onFinish"] = (signUpParams) => {
    const mutation = state ? oauthSignUpMutation : signUpMutation;
    mutation.mutate(signUpParams);
  };

  useEffect(() => {
    if (!state) return;
    signUpForm.setFieldValue("email", state.email);
    signUpForm.setFieldValue("name", state.user_metadata.name);
  }, [state]);

  return (
    <main className="h-full flex flex-col items-center">
      <Typography.Title>회원가입</Typography.Title>
      <Form className="w-full" form={signUpForm} onFinish={onFinish} autoComplete="off">
        <Form.Item<ISignUpParams>
          name="email"
          rules={[
            { required: true, message: REQUIRED_EMAIL },
            {
              type: "email",
              message: INVALID_FORMAT_EMAIL,
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
              pattern: PHONE_REGEXP.PATTERN,
              message: PHONE_REGEXP.MESSAGE,
            },
          ]}
        >
          <Input placeholder={REQUIRED_PHONE} />
        </Form.Item>

        {!state && (
          <>
            <Form.Item<ISignUpParams>
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
            <Form.Item<ISignUpParams>
              name="passwordConfirm"
              dependencies={["password"]}
              rules={[
                { required: true, message: REQUIRED_PASSWORD },
                {
                  pattern: PASSWORD_REGEXP.PATTERN,
                  message: PASSWORD_REGEXP.MESSAGE,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) return Promise.resolve();
                    return Promise.reject(INVALID_RE_PASSWORD);
                  },
                }),
              ]}
            >
              <Input.Password placeholder={REQUIRED_PASSWORD} />
            </Form.Item>
          </>
        )}

        <Form.Item<ISignUpParams>
          name="gender"
          rules={[{ required: true, message: "성별을 입력해주세요" }]}
        >
          <Radio.Group>
            <Radio value="M">남</Radio>
            <Radio value="F">녀</Radio>
            <Radio value="N">미선택</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item<ISignUpParams>
          name="birthDate"
          rules={[{ required: true, message: "생년월일을 입력해주세요" }]}
        >
          <DatePicker className="w-full" placeholder="생년월일을 입력해주세요" />
        </Form.Item>

        <Form.Item<ISignUpParams>
          name="defaultAddress"
          rules={[{ required: true, message: "주소를 입력해주세요" }]}
        >
          <Input
            readOnly
            onClick={() => {
              new window.daum.Postcode({
                oncomplete: ({ address }: { address: string }) =>
                  signUpForm.setFieldValue("defaultAddress", address),
              }).open();
            }}
            placeholder="주소를 입력해주세요"
          />
        </Form.Item>
        <Form.Item>
          <Flex gap="middle">
            <Button
              disabled={signUpMutation.isPending}
              className="flex-grow"
              type="primary"
              htmlType="submit"
            >
              회원가입
            </Button>
            <Button onClick={() => navigate("/signin")} className="flex-grow" htmlType="button">
              뒤로
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </main>
  );
};

export default Page;
