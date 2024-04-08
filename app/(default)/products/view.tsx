"use client";
import { Table, TableProps } from "antd";
import { FC } from "react";

import useFetch from "@/app/_hooks/useFetch";

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
  const { data: products, isLoading } = useFetch(() => {
    return fetch("/api/products")
      .then((response) => response.json())
      .then((jsonResponse) => jsonResponse)
      .catch(console.error);
  });
  console.log(products);
  if (isLoading) return null;
  return <Table columns={columns} dataSource={products.listProduct} />;
};

export default View;
