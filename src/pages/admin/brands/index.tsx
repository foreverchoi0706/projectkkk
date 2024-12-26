import admin from "@/queryKeys/admin";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import type { IBrand } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Flex, Spin, Table, type TableProps } from "antd";
import type { FC } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: brands } = useQuery(admin.brands.pages(searchParams.toString()));

  if (!brands) return <Spin />;
  const columns: TableProps<IBrand>["columns"] = [
    {
      align: "center",
      dataIndex: "name",
      title: "브랜드",
      render: (value) => <>{value || "-"}</>,
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Table<IBrand>
        scroll={{ y: 550 }}
        title={() => "브랜드관리"}
        rowKey={({ name }) => name}
        columns={columns}
        locale={{ emptyText: "검색결과가 없습니다" }}
        dataSource={brands.content}
        pagination={{
          onChange: (page) => navigate(`${pathname}?page=${page}`, { replace: true }),
          pageSize: DEFAULT_LIST_PAGE_SIZE,
          current: brands.page + 1,
          total: brands.totalCount,
          showSizeChanger: false,
        }}
      />
    </Flex>
  );
};

export default Page;
