import admin from "@/queryKeys/admin";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import { IBrand, IShipping } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Flex, Spin, Table, TableProps } from "antd";
import { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: brands } = useQuery(admin.shippings.pages(searchParams.toString()));

  if (!brands) return <Spin />;
  const columns: TableProps<IShipping>["columns"] = [
    {
      align: "center",
      dataIndex: "id",
      key: "id",
      title: "id",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "deliveryNum",
      key: "deliveryNum",
      title: "deliveryNum",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "orderDate",
      key: "orderDate",
      title: "orderDate",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
      title: "deliveryAddress",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "totalAmount",
      key: "totalAmount",
      title: "totalAmount",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "deliveryType",
      key: "deliveryType",
      title: "deliveryType",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "arrivedDate",
      key: "arrivedDate",
      title: "arrivedDate",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "departureDate",
      key: "departureDate",
      title: "departureDate",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "deliveryStatusType",
      key: "deliveryStatusType",
      title: "deliveryStatusType",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "deliveryCost",
      key: "deliveryCost",
      title: "deliveryCost",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "memberEmail",
      key: "memberEmail",
      title: "memberEmail",
      render: (value) => <>{value || "-"}</>,
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Table<IShipping>
        scroll={{ y: 550 }}
        title={() => "배송관리"}
        rowKey={({ id }) => id}
        columns={columns}
        locale={{ emptyText: "검색결과가 없습니다" }}
        dataSource={brands.content}
        pagination={{
          onChange: (page) => navigate(`/admin/shippings?page=${page}`, { replace: true }),
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
