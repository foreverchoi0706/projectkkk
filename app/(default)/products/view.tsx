"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Flex,
  Form,
  FormProps,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
} from "antd";
import { FC, useState } from "react";

import fetcher from "@/app/_utils/fetcher";
import queryKeyStore from "@/app/_utils/queryKeyStore";
import { Product } from "@/app/_utils/types";
import { Response } from "@/app/_utils/types";

const columns: TableProps<Product>["columns"] = [
  {
    align: "center",
    dataIndex: "No.",
    key: "No.",
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
      return <Button type="primary">상세</Button>;
    },
    title: "상세",
  },
];

const View: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate } = useMutation<Response<Product>, Error, Product>({
    mutationFn: (product) =>
      fetcher.post<Product>("/api/products", {
        ...product,
      }),
  });

  const { data: products = [], isLoading } = useQuery(
    queryKeyStore.products.all(),
  );

  const { data: brands = [] } = useQuery({
    ...queryKeyStore.brands.all(),
    enabled: isOpen,
    gcTime: Infinity,
    select: ({ result }) => result,
    staleTime: Infinity,
  });

  const onFinish: FormProps<Product>["onFinish"] = (product) => {
    mutate(product);
  };

  if (isLoading) return null;
  return (
    <Flex vertical gap="middle">
      {isOpen && (
        <Modal
          title="상품 등록"
          open={isOpen}
          footer={null}
          okButtonProps={{}}
          onCancel={() => setIsOpen(false)}
        >
          <Form onFinish={onFinish}>
            <Form.Item<Product> name="name" rules={[{ required: true }]}>
              <Input placeholder="이름" />
            </Form.Item>
            <Form.Item<Product> name="brand" rules={[{ required: true }]}>
              <Select placeholder="브랜드">
                {brands.map((brand) => (
                  <Select.Option key={brand}>{brand}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item<Product> name="category" rules={[{ required: true }]}>
              <Input placeholder="카테고리" />
            </Form.Item>
            <Form.Item<Product> name="image" rules={[{ required: true }]}>
              <Input
                placeholder="이미지"
                type="file"
                accept=".png,.jpg,.jpeg,.png,.webp"
              />
            </Form.Item>
            <Form.Item<Product> name="stock" rules={[{ required: true }]}>
              <Input placeholder="수량" type="number" />
            </Form.Item>
            <Form.Item<Product> name="selledcount" rules={[{ required: true }]}>
              <Input placeholder="팔린 수량" type="number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                등록
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
      <Flex gap="middle">
        <Button type="primary" onClick={() => setIsOpen(true)}>
          등록
        </Button>
      </Flex>
      <Table columns={columns} dataSource={products} />
    </Flex>
  );
};

export default View;
