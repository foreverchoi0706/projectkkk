import { FC } from "react";
import { Table, TableProps } from "antd";
import useFetch from "@/hooks/useFetch.ts";
import { getProducts } from "@/utils/apis.ts";

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
    title: "id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "brand",
    dataIndex: "brand",
    key: "brand",
  },
  {
    title: "selledcount",
    dataIndex: "selledcount",
    key: "selledcount",
    render: (value) => <>{value ?? "-"}</>,
  },
  {
    title: "category",
    key: "category",
    dataIndex: "category",
  },
  {
    title: "name",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "stock",
    key: "stock",
    dataIndex: "stock",
  },
];

const Products: FC = () => {
  const { data: products, isLoading } = useFetch(getProducts);
  if (isLoading) return null;
  return <Table columns={columns} dataSource={products.listProduct} />;
};

export default Products;
