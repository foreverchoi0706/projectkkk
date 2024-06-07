import { FC, useState } from "react";
import { Button, Flex, Input, Spin, Table, TableProps } from "antd";
import { IProduct } from "@/utils/types.ts";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/utils/queryKeys.ts";
import { useNavigate, useSearchParams } from "react-router-dom";
import UpsertModal from "@/pages/products/UpsertModal";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";

const Page: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedProductId, setSelectedProductId] = useState<string | null>();
  const isOpen = selectedProductId !== undefined;
  searchParams.set("size", DEFAULT_LIST_PAGE_SIZE);
  const { data: products } = useQuery(queryKeys.products.all(searchParams.toString()));
  if (!products) return <Spin />;
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
      render: () => (
        <Button onClick={() => setSelectedProductId(undefined)} type="primary">
          상세
        </Button>
      ),
      title: "상세",
    },
  ];
  return (
    <Flex vertical gap="middle">
      {isOpen && (
        <UpsertModal
          setSelectedProductId={setSelectedProductId}
          productId={selectedProductId}
          open={isOpen}
          footer={null}
          okButtonProps={{}}
          onCancel={() => setSelectedProductId(undefined)}
          queryString={searchParams.toString()}
        />
      )}
      <Flex gap="middle">
        <Input />
        <Input />
        <Button type="primary">검색</Button>
        <Button type="default" onClick={() => setSelectedProductId(null)}>
          상품 추가
        </Button>
      </Flex>
      <Table
        title={() => "상품관리"}
        onRow={(_, rowIndex = 0) => {
          return {
            onClick: () => {
              const product = products.content.at(rowIndex);
              if (product?.name) setSelectedProductId(product.name);
            },
          };
        }}
        rowKey={({ id }) => id}
        columns={columns}
        dataSource={products.content}
        pagination={{
          showSizeChanger: true,
          onChange: (page) => navigate(`/products?page=${page}`, { replace: true }),
          pageSize: +DEFAULT_LIST_PAGE_SIZE,
          current: products.page,
          total: products.totalCount,
        }}
      />
    </Flex>
  );
};

export default Page;
