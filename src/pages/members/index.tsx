import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants.ts";
import queryKeys, { axiosInstance } from "@/utils/queryKeys.ts";
import { IMember, IMemberSearchParams, TError } from "@/utils/types.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Form, FormProps, Input, Spin, Table, TableProps } from "antd";
import queryString from "query-string";
import { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<IMemberSearchParams>();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { data: members } = useQuery(queryKeys.members.all(searchParams.toString()));
  const onFinish: FormProps<IMemberSearchParams>["onFinish"] = (memberSearchParams) => {
    const page = searchParams.get("page");
    navigate(
      `/members?${queryString.stringify({ ...memberSearchParams, page }, { skipEmptyString: true })}`,
      {
        replace: true,
      },
    );
  };

  const deleteMemberMutation = useMutation<null, TError, number>({
    mutationFn: (memberId: number) => axiosInstance.delete(`/member/delete?memberId=${memberId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeys.members.all(searchParams.toString()));
      alert("멤버가 삭제되었습니다");
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

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
        <Flex gap="middle">
          <Form.Item<IMemberSearchParams> name="id">
            <Input min="0" type="number" placeholder="멤버아이디" />
          </Form.Item>
          <Form.Item<IMemberSearchParams> name="email">
            <Input placeholder="이메일" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              검색
            </Button>
          </Form.Item>
        </Flex>
      </Form>

      <Table<IMember>
        title={() => "멤버관리"}
        rowKey={({ id }) => id}
        columns={columns}
        locale={{
          emptyText: "검색결과가 없습니다",
        }}
        dataSource={members.content}
        pagination={{
          onChange: (page) => navigate(`/members?page=${page}`, { replace: true }),
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
