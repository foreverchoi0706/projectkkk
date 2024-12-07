import admin from "@/queryKeys/admin";
import axiosInstance from "@/utils/axiosInstance";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import type { IAccount, TError, TRole } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flex, Select, Spin, Table, type TableProps } from "antd";
import type { FC } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { data: accounts } = useQuery(admin.accounts.all(searchParams.toString()));

  const useChangeRoleMutation = useMutation<unknown, TError, { role: TRole; id: number }>({
    mutationFn: ({ id, role }) =>
      axiosInstance.post(`/admin/auth/authorization?memberId=${id}&authority=${role}`),
    onSuccess: () => {
      alert("권한이 변경되었습니다.");
      queryClient.invalidateQueries(admin.accounts.all(searchParams.toString()));
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onChangeRole = (role: TRole, id: number) => {
    if (!window.confirm("해당 회원의 권한을 변경하시겠습니까?")) return;
    useChangeRoleMutation.mutate({ role, id });
  };

  if (!accounts) return <Spin />;
  const columns: TableProps<IAccount>["columns"] = [
    {
      align: "center",
      dataIndex: "No.",
      key: "No.",
      render: (_, __, index) => <>{DEFAULT_LIST_PAGE_SIZE * accounts.page + index + 1}</>,
      title: "No.",
    },
    {
      align: "center",
      dataIndex: "id",
      key: "id",
      title: "회원번호",
    },
    {
      align: "center",
      dataIndex: "name",
      key: "name",
      title: "회원명",
    },
    {
      align: "center",
      dataIndex: "role",
      key: "role",
      title: "권한",
      render: (value, { id }) => (
        <Select defaultValue={value} onChange={(role) => onChangeRole(role, id)}>
          <Select.Option value="center">중앙관리자</Select.Option>
          <Select.Option value="admin">관리자</Select.Option>
          <Select.Option value="user">회원</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Table<IAccount>
        scroll={{ y: 550 }}
        title={() => "권한관리"}
        rowKey={({ id }) => id}
        columns={columns}
        locale={{ emptyText: "검색결과가 없습니다" }}
        dataSource={accounts.content}
        pagination={{
          onChange: (page) => navigate(`${pathname}?page=${page}`, { replace: true }),
          pageSize: DEFAULT_LIST_PAGE_SIZE,
          current: accounts.page + 1,
          total: accounts.totalCount,
          showSizeChanger: false,
        }}
      />
    </Flex>
  );
};

export default Page;
