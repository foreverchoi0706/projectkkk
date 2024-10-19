import admin, { axiosInstance } from "@/queryKeys/admin";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import { IMember, IMemberSearchParams, TError } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Flex,
  Form,
  FormProps,
  Input,
  Row,
  Select,
  Spin,
  Table,
  TableProps,
} from "antd";
import queryString from "query-string";
import { FC } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<IMemberSearchParams>();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams({ size: DEFAULT_LIST_PAGE_SIZE.toString(), page: "1" });
  const { data: members } = useQuery(admin.members.all(searchParams.toString()));
  const deleteMemberMutation = useMutation<unknown, TError, number>({
    mutationFn: (memberId: number) =>
      axiosInstance.delete(`/admin/member/delete?memberId=${memberId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries(admin.members.all(searchParams.toString()));
      alert("멤버가 삭제되었습니다");
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onFinish: FormProps<IMemberSearchParams>["onFinish"] = (memberSearchParams) => {
    const page = searchParams.get("page");
    navigate(
      `/admin/members?${queryString.stringify({ ...memberSearchParams, page }, { skipEmptyString: true })}`,
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
      key: "No.",
      render: (_, __, index) => <>{DEFAULT_LIST_PAGE_SIZE * members.page + index + 1}</>,
      title: "No.",
    },
    {
      align: "center",
      dataIndex: "id",
      key: "id",
      title: "회원아이디",
    },
    {
      align: "center",
      dataIndex: "name",
      key: "name",
      title: "회원명",
    },
    {
      align: "center",
      dataIndex: "phone",
      key: "phone",
      title: "전화번호",
    },
    {
      align: "center",
      dataIndex: "email",
      key: "email",
      title: "이메일",
    },
    {
      align: "center",
      dataIndex: "role",
      key: "role",
      title: "권한",
    },
    {
      align: "center",
      dataIndex: "deleteButton",
      key: "deleteButton",
      onCell: ({ id }) => ({
        onClick: () => {
          if (!window.confirm("해당 멤버를 삭제하시겠습니까?")) return;
          deleteMemberMutation.mutate(id);
        },
      }),
      render: () => <Button>삭제</Button>,
      title: "삭제",
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
                <Select.Option value="center">중앙관리자</Select.Option>
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
                <Link to="/admin/members" onClick={() => form.resetFields()}>
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
              `/admin/members?${queryString.stringify({ ...form.getFieldsValue(), page }, { skipEmptyString: true })}`,
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
