import admin from "@/queryKeys/admin";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import type { IBrand } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Flex, Spin, Table, type TableProps } from "antd";
import type { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: brands } = useQuery(admin.brands.pages(searchParams.toString()));

  if (!brands) return <Spin />;
  const columns: TableProps<IBrand>["columns"] = [
    {
      align: "center",
      dataIndex: "id",
      key: "id",
      title: "id",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "name",
      key: "name",
      title: "name",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "brand",
      key: "brand",
      title: "brand",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "category",
      key: "category",
      title: "category",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "productNum",
      key: "productNum",
      title: "productNum",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "price",
      key: "price",
      title: "price",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "discountRate",
      key: "discountRate",
      title: "discountRate",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "description",
      key: "description",
      title: "description",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "imageUrl",
      key: "imageUrl",
      title: "imageUrl",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "productCouponResponse",
      key: "productCouponResponse",
      title: "productCouponResponse",
      render: (value) => <>{JSON.stringify(value) || "-"}</>,
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
          onChange: (page) => navigate(`/admin/brands?page=${page}`, { replace: true }),
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
