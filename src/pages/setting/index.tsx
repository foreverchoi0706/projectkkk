import { axiosInstance } from "@/utils/queryKeys";
import { IResponse, ISignInParams, IUserInfo, TError } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { Form, Input, Flex, Button, FormProps } from "antd";
import { AxiosResponse } from "axios";
import { FC } from "react";

const Setting: FC = () => {
  const memberVerifyMutation = useMutation<
    AxiosResponse<IResponse<IUserInfo>>,
    TError,
    ISignInParams
  >({
    mutationFn: () => axiosInstance.post("/api/member/verify"),
  });

  const onFinish: FormProps<ISignInParams>["onFinish"] = (signInParams) => {
    memberVerifyMutation.mutate(signInParams);
  };
  return (
    <Form onFinish={onFinish}>
      <Form.Item<ISignInParams> name="email" rules={[{ required: true }]}>
        <Input placeholder="email" />
      </Form.Item>

      <Form.Item<ISignInParams> name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="password" />
      </Form.Item>

      <Form.Item>
        <Flex gap="middle">
          <Button
            disabled={memberVerifyMutation.isPending}
            style={{ flexGrow: "1" }}
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
