"use client";
import { useQuery } from "@tanstack/react-query";
import { Table, TableProps } from "antd";
import { FC } from "react";

import queryKeyStore from "@/app/_utils/queryKeyStore";

interface DataType {
  id: number;
  brand: string;
  selledcount: null | number;
  category: string;
  name: string;
  stock: number;
  image: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    dataIndex: "id",
    key: "id",
    title: "id",
  },
  {
    dataIndex: "brand",
    key: "brand",
    title: "brand",
  },
  {
    dataIndex: "selledcount",
    key: "selledcount",
    render: (value) => <>{value ?? "-"}</>,
    title: "selledcount",
  },
  {
    dataIndex: "category",
    key: "category",
    title: "category",
  },
  {
    dataIndex: "name",
    key: "name",
    title: "name",
  },
  {
    dataIndex: "stock",
    key: "stock",
    title: "stock",
  },
];

const View: FC = () => {
  const { data: members, isLoading } = useQuery({
    ...queryKeyStore.members.all(),
  });
  if (isLoading) return null;
  return <Table columns={columns} dataSource={members.listMember} />;
};

export default View;
