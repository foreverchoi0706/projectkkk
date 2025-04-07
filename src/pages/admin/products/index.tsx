import UpsertModal from "@/pages/admin/products/UpsertModal";
import admin from "@/queryKeys/admin";
import axiosInstance from "@/utils/axiosInstance.ts";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import type { IProduct, IProductSearchParams, TError } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Flex, Form, type FormProps, Input, Spin, Table, type TableProps } from "antd";
import queryString from "query-string";
import { type FC, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm<IProductSearchParams>();
  const [searchParams] = useSearchParams({ size: DEFAULT_LIST_PAGE_SIZE.toString(), page: "1" });
  const [selectedProductId, setSelectedProductId] = useState<number | null>();
  const isOpen = selectedProductId !== undefined;

  const { data: products } = useQuery(admin.products.pages(searchParams.toString()));

  const assignCouponMutation = useMutation<unknown, TError, IProduct>({
    mutationFn: (product) =>
      axiosInstance.post(`/admin/coupon/assignCouponToProduct`, {
        couponId: product.id,
        assignType: "SPECIFIC_PRODUCTS",
        brand: product.brand,
        category: product.category,
        productName: product.name,
        content: product.name,
        color: product.color,
        size: product.size,
      }),
    onSuccess: () => alert("쿠폰이 지급되었습니다"),
    onError: ({ result }) => alert(result.errorMessage),
  });

  const onFinish: FormProps<IProductSearchParams>["onFinish"] = (productSearchParams) => {
    const page = searchParams.get("page");
    navigate(
      `${pathname}?${queryString.stringify({ ...productSearchParams, page }, { skipEmptyString: true })}`,
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
      render: (_, __, index) => <>{DEFAULT_LIST_PAGE_SIZE * products.page + index + 1}</>,
      title: "No.",
    },
    {
      align: "center",
      dataIndex: "name",
      title: "상품명",
      render: (value) => <>{value ?? "-"}</>,
    },
    {
      align: "center",
      dataIndex: "id",
      title: "상품번호",
      render: (value) => <>{value ?? "-"}</>,
    },
    {
      align: "center",
      dataIndex: "brand",
      title: "브랜드",
      render: (value) => <>{value ?? "-"}</>,
    },
    {
      align: "center",
      dataIndex: "price",
      render: (value) => <>{value ?? "-"}</>,
      title: "가격",
    },
    {
      align: "center",
      dataIndex: "selledcount",
      render: (value) => <>{value ?? "-"}</>,
      title: "판매량",
    },
    {
      align: "center",
      dataIndex: "category",
      title: "카테고리",
      render: (value) => <>{value ?? "-"}</>,
    },
    {
      align: "center",
      dataIndex: "name",
      title: "상품명",
      render: (value) => <>{value ?? "-"}</>,
    },
    {
      align: "center",
      dataIndex: "stock",
      title: "현재 재고",
      render: (value) => <>{value ?? "-"}</>,
    },
    {
      align: "center",
      title: "쿠폰 지급",
      render: (_, product) => (
        <Button
          onClick={() => {
            if (!window.confirm("해당 상품에게 쿠폰을 지급하시겠습니까?")) return;
            assignCouponMutation.mutate(product);
          }}
        >
          지급
        </Button>
      ),
    },
    {
      title: "상세",
      align: "center",
      render: (_, { id }) => (
        <Button onClick={() => setSelectedProductId(id)} type="primary">
          상세
        </Button>
      ),
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Form<IProductSearchParams> form={form} onFinish={onFinish}>
        <Flex gap="middle">
          <Form.Item<IProductSearchParams> name="id">
            <Input min="0" type="number" placeholder="상품아이디" />
          </Form.Item>
          <Form.Item<IProductSearchParams> name="productName">
            <Input placeholder="상품명" />
          </Form.Item>
          <Form.Item<IProductSearchParams> name="brand">
            <Input placeholder="브랜드명" />
          </Form.Item>
          <Form.Item<IProductSearchParams> name="category">
            <Input placeholder="카테고리" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              검색
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to={pathname} onClick={() => form.resetFields()}>
              <Button>초기화</Button>
            </Link>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setSelectedProductId(null)}>상품 추가</Button>
          </Form.Item>
        </Flex>
      </Form>

      <Table<IProduct>
        scroll={{ y: 550 }}
        title={() => "상품관리"}
        rowKey={({ id }) => id}
        columns={columns}
        locale={{ emptyText: "검색결과가 없습니다" }}
        dataSource={products.content}
        pagination={{
          onChange: (page) => {
            navigate(
              `${pathname}?${queryString.stringify({ ...form.getFieldsValue(), page }, { skipEmptyString: true })}`,
              {
                replace: true,
              },
            );
          },
          pageSize: DEFAULT_LIST_PAGE_SIZE,
          current: products.page + 1,
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
          onCancel={() => setSelectedProductId(undefined)}
          queryString={searchParams.toString()}
        />
      )}
    </Flex>
  );
};

export default Page;
