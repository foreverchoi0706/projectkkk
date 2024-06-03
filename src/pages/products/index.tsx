import { FC } from "react";
import { Button, Table, TableProps } from "antd";
import { IProduct } from "@/utils/types.ts";
import { useInfiniteQuery } from "@tanstack/react-query";
import queryKeys from "@/utils/queryKeys.ts";

const columns: TableProps<IProduct>["columns"] = [
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
    title: "상품번호",
  },
  {
    align: "center",
    dataIndex: "brand",
    key: "brand",
    title: "브랜드",
  },
  {
    align: "center",
    dataIndex: "selledcount",
    key: "selledcount",
    render: (value) => <>{value ?? "-"}</>,
    title: "판매량",
  },
  {
    align: "center",
    dataIndex: "category",
    key: "category",
    title: "카테고리",
  },
  {
    align: "center",
    dataIndex: "name",
    key: "name",
    title: "상품명",
  },
  {
    align: "center",
    dataIndex: "stock",
    key: "stock",
    title: "수량",
  },
  {
    align: "center",
    dataIndex: "detailButton",
    key: "detailButton",
    render: (value) => {
      console.log(value);
      return <Button type="primary">수정</Button>;
    },
    title: "수정",
  },
];

const Page: FC = () => {
  // @ts-ignore
  const { data: products } = useInfiniteQuery({
    ...queryKeys.products.all(),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.result.totalCount > allPages.length
        ? lastPage.result.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
  console.log(products);
  if (!products) return null;
  return (
    <Table
      rowKey={({ id }) => id}
      columns={columns}
      dataSource={products.pages[0].result.content}
      pagination={{
        current: products.pages[0].result.page,
        total: products.pages[0].result.totalCount,
      }}
    />
  );
};

export default Page;
