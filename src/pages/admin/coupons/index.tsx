import admin from "@/queryKeys/admin";
import axiosInstance from "@/utils/axiosInstance";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import type { ICoupon, IProduct, TError } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Spin,
  Table,
  type TableProps,
} from "antd";
import { type FC, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: couponPages } = useQuery(admin.coupons.pages(searchParams.toString()));

  const addCouponMutation = useMutation<unknown, TError, IProduct>({
    mutationFn: (product: IProduct) => axiosInstance.post("/admin/coupon/join", product),
    onSuccess: () => {
      queryClient.invalidateQueries(admin.coupons.pages(searchParams.toString())).then(() => {
        alert("쿠폰이 추가되었습니다");
        setIsOpen(false);
      });
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const deleteCouponMutation = useMutation<unknown, TError, number>({
    mutationFn: (id) => axiosInstance.delete(`/admin/coupon/delete?couponId=${id}`),
    onSuccess: () => {
      queryClient
        .invalidateQueries(admin.coupons.pages(searchParams.toString()))
        .then(() => alert("쿠폰이 삭제되었습니다"));
    },
    onError: ({ result }) => alert(result.errorMessage),
  });

  const assignCouponMutation = useMutation<unknown, TError, number>({
    mutationFn: (id) =>
      axiosInstance.post(`/admin/coupon/assignCouponToMember`, {
        couponId: id,
        assignType: "ALL",
      }),
    onSuccess: () => alert("쿠폰이 지급되었습니다"),
    onError: ({ result }) => alert(result.errorMessage),
  });

  if (!couponPages) return <Spin />;
  const columns: TableProps<ICoupon>["columns"] = [
    {
      align: "center",
      dataIndex: "id",
      key: "id",
      title: "id",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "name",
      key: "name",
      title: "name",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "assignBy",
      key: "assignBy",
      title: "assignBy",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "discountRate",
      key: "discountRate",
      title: "discountRate",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "startDate",
      key: "startDate",
      title: "startDate",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "endDate",
      key: "endDate",
      title: "endDate",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "button",
      key: "button",
      title: "쿠폰 지급",
      render: (_, { id }) => (
        <Button
          onClick={() => {
            if (!window.confirm("전체 회원에게 쿠폰을 지급하시겠습니까?")) return;
            assignCouponMutation.mutate(id);
          }}
        >
          지급
        </Button>
      ),
    },
    {
      align: "center",
      dataIndex: "button",
      key: "button",
      title: "삭제",
      render: (_, { id }) => (
        <Button
          onClick={() => {
            if (!window.confirm("해당 쿠폰을 삭제하시겠습니까?")) return;
            deleteCouponMutation.mutate(id);
          }}
        >
          삭제
        </Button>
      ),
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Row gutter={16}>
        <Col span={4}>
          <Form.Item>
            <Button onClick={() => setIsOpen(true)}>쿠폰 생성</Button>
          </Form.Item>
        </Col>
      </Row>
      <Table<ICoupon>
        scroll={{ y: 550 }}
        title={() => "쿠폰 관리"}
        rowKey={({ id }) => id}
        columns={columns}
        locale={{ emptyText: "검색결과가 없습니다" }}
        dataSource={couponPages.content}
        pagination={{
          onChange: (page) => navigate(`${pathname}?page=${page}`, { replace: true }),
          pageSize: DEFAULT_LIST_PAGE_SIZE,
          current: couponPages.page + 1,
          total: couponPages.totalCount,
          showSizeChanger: false,
        }}
      />
      {isOpen && (
        <Modal title="쿠폰 생성" open={isOpen} footer={null} onCancel={() => setIsOpen(false)}>
          <Form onFinish={addCouponMutation.mutate}>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "이름은 필수입니다",
                },
              ]}
            >
              <Input className="w-full" placeholder="name" />
            </Form.Item>
            <Form.Item
              name="discountRate"
              rules={[
                {
                  required: true,
                  message: "할인율은 필수입니다",
                },
              ]}
            >
              <InputNumber className="w-full" placeholder="discountRate" />
            </Form.Item>
            <Form.Item
              name="startDate"
              rules={[
                {
                  required: true,
                  message: "기간 시작일은 필수입니다",
                },
              ]}
            >
              <DatePicker className="w-full" placeholder="startDate" />
            </Form.Item>
            <Form.Item
              name="endDate"
              rules={[
                {
                  required: true,
                  message: "기간 종료일은 필수입니다",
                },
              ]}
            >
              <DatePicker className="w-full" placeholder="endDate" />
            </Form.Item>
            <Form.Item>
              <Button
                disabled={addCouponMutation.isPending}
                type="primary"
                htmlType="submit"
                className="w-full"
              >
                생성
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Flex>
  );
};

export default Page;
