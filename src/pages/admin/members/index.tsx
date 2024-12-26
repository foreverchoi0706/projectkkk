import admin from "@/queryKeys/admin";
import axiosInstance from "@/utils/axiosInstance";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import type { IMember, IMemberSearchParams, TError } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Flex,
  Form,
  type FormProps,
  Input,
  Row,
  Select,
  Spin,
  Table,
  type TableProps,
} from "antd";
import queryString from "query-string";
import type { FC } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm<IMemberSearchParams>();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams({ size: DEFAULT_LIST_PAGE_SIZE.toString(), page: "1" });
  const { data: members } = useQuery(admin.members.pages(searchParams.toString()));
  const deleteMemberMutation = useMutation<unknown, TError, number>({
    mutationFn: (memberId: number) =>
      axiosInstance.delete(`/admin/member/delete?memberId=${memberId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries(admin.members.pages(searchParams.toString()));
      alert("멤버가 삭제되었습니다");
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onFinish: FormProps<IMemberSearchParams>["onFinish"] = (memberSearchParams) => {
    const page = searchParams.get("page");
    navigate(
      `${pathname}?${queryString.stringify({ ...memberSearchParams, page }, { skipEmptyString: true })}`,
      {
        replace: true,
      },
    );
  };

  if (!members) return <Spin />;
  const columns: TableProps<IMember>["columns"] = [
    {
      align: "center",
      dataIndex: "No.",
      render: (_, __, index) => <>{DEFAULT_LIST_PAGE_SIZE * members.page + index + 1}</>,
      title: "No.",
    },
    {
      align: "center",
      dataIndex: "id",
      title: "회원아이디",
    },
    {
      align: "center",
      dataIndex: "name",
      title: "회원명",
    },
    {
      align: "center",
      dataIndex: "phone",
      title: "전화번호",
    },
    {
      align: "center",
      dataIndex: "email",
      title: "이메일",
    },
    {
      align: "center",
      dataIndex: "role",
      title: "권한",
    },
    {
      align: "center",
      title: "삭제",
      render: (_, { id }) => (
        <Button
          onClick={() => {
            if (!window.confirm("해당 멤버를 삭제하시겠습니까?")) return;
            deleteMemberMutation.mutate(id);
          }}
        >
          삭제
        </Button>
      ),
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Form<IMemberSearchParams> form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item<IMemberSearchParams> name="name">
              <Input placeholder="회원명" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item<IMemberSearchParams> name="email">
              <Input placeholder="이메일" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item<IMemberSearchParams> name="phone">
              <Input placeholder="전화번호" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item<IMemberSearchParams> name="role">
              <Select placeholder="권한">
                <Select.Option value="center">관리자</Select.Option>
                <Select.Option value="admin">관리자</Select.Option>
                <Select.Option value="user">회원</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Flex gap={8}>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  검색
                </Button>
              </Form.Item>
              <Form.Item>
                <Link to={pathname} onClick={() => form.resetFields()}>
                  <Button>초기화</Button>
                </Link>
              </Form.Item>
            </Flex>
          </Col>
        </Row>
      </Form>

      <Table<IMember>
        scroll={{ y: 550 }}
        title={() => "멤버관리"}
        rowKey={({ id }) => id}
        columns={columns}
        locale={{ emptyText: "검색결과가 없습니다" }}
        dataSource={members.content}
        pagination={{
          onChange: (page) => {
            navigate(
              `${pathname}?${queryString.stringify({ ...form.getFieldsValue(), page }, { skipEmptyString: true })}`,
              {
                replace: true,
              },
            );
          },
          pageSize: DEFAULT_LIST_PAGE_SIZE,
          current: members.page + 1,
          total: members.totalCount,
          showSizeChanger: false,
        }}
      />
    </Flex>
  );
};

export default Page;
