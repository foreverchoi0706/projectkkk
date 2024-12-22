import UpsertModal from "@/pages/admin/products/UpsertModal";
import admin from "@/queryKeys/admin";
import axiosInstance from "@/utils/axiosInstance.ts";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import type { IProduct, IProductSearchParams, TError } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Flex, Form, Spin, Table, type TableProps } from "antd";
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

  const { data: sales } = useQuery(admin.products.sales(searchParams.toString()));

  const assignCouponMutation = useMutation<unknown, TError, number>({
    mutationFn: (id) =>
      axiosInstance.post(`/admin/coupon/assignCouponToProduct`, {
        couponId: id,
        assignType: "ALL",
      }),
    onSuccess: () => alert("쿠폰이 지급되었습니다"),
    onError: ({ result }) => alert(result.errorMessage),
  });

  if (!sales) return <Spin />;
  const columns: TableProps<IProduct>["columns"] = [
    {
      align: "center",
      dataIndex: "No.",
      key: "No.",
      render: (_, __, index) => <>{DEFAULT_LIST_PAGE_SIZE * sales.page + index + 1}</>,
      title: "No.",
    },
    {
      align: "center",
      dataIndex: "id",
      key: "id",
      title: "상품번호",
      render: (value) => <>{value ?? "-"}</>,
    },
    {
      align: "center",
      dataIndex: "brand",
      key: "brand",
      title: "브랜드",
      render: (value) => <>{value ?? "-"}</>,
    },
    {
      align: "center",
      dataIndex: "price",
      key: "price",
      render: (value) => <>{value ?? "-"}</>,
      title: "가격",
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
      render: (value) => <>{value ?? "-"}</>,
    },
    {
      align: "center",
      dataIndex: "name",
      key: "name",
      title: "상품명",
      render: (value) => <>{value ?? "-"}</>,
    },
    {
      align: "center",
      dataIndex: "stock",
      key: "stock",
      title: "현재 재고",
      render: (value) => <>{value ?? "-"}</>,
    },
    {
      align: "center",
      dataIndex: "button",
      key: "button",
      title: "쿠폰 지급",
      render: (_, { id }) => (
        <Button
          onClick={() => {
            if (!window.confirm("해당 상품에게 쿠폰을 지급하시겠습니까?")) return;
            assignCouponMutation.mutate(id);
          }}
        >
          지급
        </Button>
      ),
    },
    {
      title: "상세",
      align: "center",
      dataIndex: "detailButton",
      key: "detailButton",
      render: (_, { id }) => (
        <Button onClick={() => setSelectedProductId(id)} type="primary">
          상세
        </Button>
      ),
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Link to={searchParams.has("sort") ? pathname : `${pathname}?sort=selledcount`}>
        <Checkbox type="primary" checked={searchParams.has("sort")}>
          판매 순위 정렬
        </Checkbox>
      </Link>

      <Table<IProduct>
        scroll={{ y: 550 }}
        title={() => "판매관리"}
        rowKey={({ id }) => id}
        columns={columns}
        locale={{ emptyText: "검색결과가 없습니다" }}
        dataSource={sales.content}
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
          current: sales.page + 1,
          total: sales.totalCount,
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
