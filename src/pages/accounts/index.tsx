import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants.ts";
import queryKeys from "@/utils/queryKeys.ts";
import { IAccount } from "@/utils/types.ts";
import { useQuery } from "@tanstack/react-query";
import { Flex, Select, Spin, Table, TableProps } from "antd";
import { ChangeEvent, FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: accounts } = useQuery(queryKeys.accounts.all(searchParams.toString()));

  const onChangeRole = (e: ChangeEvent<HTMLSelectElement>, _id: number) => {
    if (!window.confirm("해당 회원의 권한을 변경하시겠습니까?")) return;
    console.log(e, _id);
  };

  if (!accounts) return <Spin />;
  const columns: TableProps<IAccount>["columns"] = [
    {
      align: "center",
      dataIndex: "No.",
      key: "No.",
      render: (_, __, index) => <>{index + 1}</>,
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
      render: (value, { id }) => {
        return (
          <Select defaultValue={value} onChange={(e) => onChangeRole(e, id)}>
            <option value="center">중앙관리자</option>
            <option value="admin">관리자</option>
            <option value="user">회원</option>
          </Select>
        );
      },
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Table<IAccount>
        title={() => "권한관리"}
        rowKey={({ id }) => id}
        columns={columns}
        locale={{
          emptyText: "검색결과가 없습니다",
        }}
        dataSource={accounts.content}
        pagination={{
          onChange: (page) => navigate(`/accounts?page=${page}`, { replace: true }),
          pageSize: +DEFAULT_LIST_PAGE_SIZE,
          current: accounts.page + 1,
          total: accounts.totalCount,
          showSizeChanger: false,
        }}
      />
    </Flex>
  );
};

export default Page;
