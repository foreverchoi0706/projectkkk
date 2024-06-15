import { FC, useState } from "react";
import { Button, Flex, Form, FormProps, Input, Spin, Table, TableProps } from "antd";
import { IProduct, IProductSearchParams } from "@/utils/types.ts";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/utils/queryKeys.ts";
import { useNavigate, useSearchParams } from "react-router-dom";
import UpsertModal from "@/pages/products/UpsertModal";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import queryString from "query-string";

const Page: FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<IProductSearchParams>();
  const [searchParams] = useSearchParams({ size: DEFAULT_LIST_PAGE_SIZE });
  const [selectedProductId, setSelectedProductId] = useState<number | null>();
  const isOpen = selectedProductId !== undefined;

  const { data: products } = useQuery(queryKeys.products.all(searchParams.toString()));

  const onFinish: FormProps<IProductSearchParams>["onFinish"] = (productSearchParams) => {
    const page = searchParams.get("page");
    navigate(
      `/products?${queryString.stringify({ ...productSearchParams, page }, { skipEmptyString: true })}`,
      {
        replace: true,
      },
    );
  };

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
      onCell: ({ id }) => ({
        onClick: () => setSelectedProductId(id),
      }),
      render: () => <Button type="primary">상세</Button>,
      title: "상세",
    },
  ];
  return (
    <Flex vertical gap="middle">
      <Form<IProductSearchParams> form={form} onFinish={onFinish}>
        <Flex gap="middle">
          <Form.Item<IProductSearchParams> name="id">
            <Input placeholder="상품아이디" />
          </Form.Item>
          <Form.Item<IProductSearchParams> name="contents">
            <Input placeholder="상품명" />
          </Form.Item>
          <Form.Item<IProductSearchParams> name="brand">
            <Input placeholder="브랜드명" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              검색
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="default" onClick={() => setSelectedProductId(null)}>
              멤버 추가
            </Button>
          </Form.Item>
        </Flex>
      </Form>

      <Table<IProduct>
        title={() => "상품관리"}
        rowKey={({ id }) => id}
        columns={columns}
        dataSource={products.content}
        pagination={{
          onChange: (page) => navigate(`/products?page=${page}`, { replace: true }),
          pageSize: +DEFAULT_LIST_PAGE_SIZE,
          current: products.page,
          total: products.totalCount,
          showSizeChanger: false,
        }}
      />
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
    </Flex>
  );
};

export default Page;
