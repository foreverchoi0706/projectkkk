"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Flex,
  Form,
  FormProps,
  Grid,
  Input,
  Modal,
  Table,
  TableProps,
} from "antd";
import { FC, useState } from "react";

import queryKeyStore from "@/app/_utils/queryKeyStore";
import { Product } from "@/app/_utils/types";

const columns: TableProps<Product>["columns"] = [
  {
    align: "center",
    dataIndex: "id",
    key: "id",
    title: "아이디",
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
  const { data: products = [], isLoading } = useQuery({
    ...queryKeyStore.products.all(),
    select: ({ result }) => result,
  });

  const { data: brands = [] } = useQuery({
    ...queryKeyStore.brands.all(),
    enabled: isOpen,
    select: ({ result }) => result,
  });

  console.log(brands);
  const onFinish: FormProps<Product>["onFinish"] = (values) => {
    console.log("Success:", values);
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
              <Input placeholder="브랜드" />
            </Form.Item>
            <Form.Item<Product> name="category" rules={[{ required: true }]}>
              <Input placeholder="카테고리" />
            </Form.Item>
            <Form.Item<Product> name="image" rules={[{ required: true }]}>
              <Input placeholder="이미지" type="file" />
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
