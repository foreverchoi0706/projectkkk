"use client";
import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/utils/axiosInstance";
import {
  INVALID_FORMAT_EMAIL,
  INVALID_FORMAT_PASSWORD,
  INVALID_FORMAT_PHONE,
  INVALID_RE_PASSWORD,
  REQUIRED_EMAIL,
  REQUIRED_NAME,
  REQUIRED_PASSWORD,
  REQUIRED_PHONE,
} from "@/utils/constants";
import { IAuth, IResponse, ISignUpParams, TError } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { Button, DatePicker, Flex, Form, FormProps, Input, Layout, Radio, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosResponse } from "axios";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const Page: FC = () => {
  const [form] = useForm<ISignUpParams>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const signUpMutation = useMutation<AxiosResponse<IResponse<IAuth>>, TError, ISignUpParams>({
    mutationFn: (signUpParams: ISignUpParams) => axiosInstance.post("/member/join", signUpParams),
    onSuccess: ({ data }) => login(data.result),
    onError: ({ result }) => alert(result.errorMessage),
  });

  const onFinish: FormProps<ISignUpParams>["onFinish"] = (signUpParams) => {
    signUpMutation.mutate(signUpParams);
  };

  return (
    <Layout className="flex items-center justify-center">
      <Typography.Title>회원가입</Typography.Title>
      <Form form={form} onFinish={onFinish} autoComplete="off">
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
              pattern: /^01[0-9][0-9]{8,9}$/,
              message: INVALID_FORMAT_PHONE,
            },
          ]}
        >
          <Input type="number" placeholder={REQUIRED_PHONE} />
        </Form.Item>

        <Form.Item<ISignUpParams>
          name="password"
          rules={[
            { required: true, message: REQUIRED_PASSWORD },
            {
              pattern: /^(?=.*[a-z])(?=.*[0-9])(?=.*[\W_])(?=.*[A-Z]).{12,}$/,
              message: INVALID_FORMAT_PASSWORD,
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
              pattern: /^(?=.*[a-z])(?=.*[0-9])(?=.*[\W_])(?=.*[A-Z]).{12,}$/,
              message: INVALID_FORMAT_PASSWORD,
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

        <Form.Item<ISignUpParams>
          name="gender"
          rules={[{ required: true, message: REQUIRED_PASSWORD }]}
        >
          <Radio.Group>
            <Radio value="M">남</Radio>
            <Radio value="F">녀</Radio>
            <Radio value="N">미선택</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item<ISignUpParams>
          name="birthDate"
          rules={[{ required: true, message: REQUIRED_PASSWORD }]}
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
                  form.setFieldValue("defaultAddress", address),
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
            <Button onClick={() => navigate(-1)} style={{ flexGrow: "1" }} htmlType="button">
              뒤로
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Page;
