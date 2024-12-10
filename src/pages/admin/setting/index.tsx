import common from "@/queryKeys/common";
import axiosInstance from "@/utils/axiosInstance";
import {
  INVALID_FORMAT_EMAIL,
  PASSWORD_REGEXP,
  PHONE_REGEXP,
  REQUIRED_EMAIL,
  REQUIRED_NAME,
  REQUIRED_PASSWORD,
  REQUIRED_PHONE,
} from "@/utils/constants";
import type { IMember, IResponse, ISignInParams, TError } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Form, type FormProps, Input } from "antd";
import type { AxiosResponse } from "axios";
import { type FC, useEffect, useState } from "react";

const Setting: FC = () => {
  const queryClient = useQueryClient();
  const [memberVerifyForm] = Form.useForm<Pick<ISignInParams, "password">>();
  const [updateMemberForm] = Form.useForm<IMember>();
  const { data: member } = useQuery(common.auth.info());
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  const updateMemberMutation = useMutation<unknown, TError, IMember>({
    mutationFn: (member) => {
      return axiosInstance.put("/admin/member/update", member, {
        headers: {
          Verification_Token: verificationToken,
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(common.auth.info());
      alert("멤버가 수정되었습니다");
    },
    onError: ({ responseMessage }) => {
      alert(responseMessage);
    },
  });

  const memberVerifyMutation = useMutation<
    AxiosResponse<
      IResponse<{
        verificationToken: string;
        successMessage: string;
      }>
    >,
    TError,
    Pick<ISignInParams, "password">
  >({
    mutationFn: ({ password }) => axiosInstance.post("/admin/member/verify", { password }),
    onSuccess: ({ data }) => setVerificationToken(data.result.verificationToken),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onFinishVerify: FormProps<Pick<ISignInParams, "password">>["onFinish"] = ({ password }) => {
    memberVerifyMutation.mutate({ password });
  };

  const onFinishUpdateMember: FormProps<IMember>["onFinish"] = (member) => {
    updateMemberMutation.mutate(member);
  };

  useEffect(() => {
    return () => setVerificationToken(null);
  }, []);

  if (verificationToken && member)
    return (
      <Form<IMember>
        className="w-96"
        initialValues={member}
        form={updateMemberForm}
        onFinish={onFinishUpdateMember}
      >
        <Form.Item<IMember>
          name="name"
          rules={[
            {
              required: true,
              message: REQUIRED_NAME,
            },
          ]}
        >
          <Input placeholder="회원명" />
        </Form.Item>
        <Form.Item<IMember>
          name="phone"
          rules={[
            { required: true, message: REQUIRED_PHONE },
            {
              pattern: PHONE_REGEXP.PATTERN,
              message: PHONE_REGEXP.MESSAGE,
            },
          ]}
        >
          <Input maxLength={11} placeholder="전화번호" />
        </Form.Item>
        <Form.Item<IMember>
          name="email"
          rules={[
            {
              required: true,
              message: REQUIRED_EMAIL,
            },
            {
              type: "email",
              message: INVALID_FORMAT_EMAIL,
            },
          ]}
        >
          <Input placeholder="이메일" />
        </Form.Item>
        <Form.Item>
          <Flex>
            <Button
              className="flex-grow"
              disabled={updateMemberMutation.isPending}
              htmlType="submit"
              type="primary"
            >
              수정
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    );

  return (
    <Form className="w-96" form={memberVerifyForm} onFinish={onFinishVerify}>
      <Form.Item<Pick<ISignInParams, "password">>
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
        <Flex>
          <Button
            disabled={memberVerifyMutation.isPending}
            className="flex-grow"
            type="primary"
            htmlType="submit"
          >
            인증
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default Setting;
