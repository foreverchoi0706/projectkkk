import QnAModal from "@/pages/admin/qnas/QnAModal";
import admin from "@/queryKeys/admin";
import axiosInstance from "@/utils/axiosInstance";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import type { ICoupon, TError } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Spin, Table, type TableProps } from "antd";
import { type FC, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [selectedQnAId, setSelectedQnAId] = useState<number | null>(null);

  const { data: couponPages } = useQuery(admin.coupons.pages(searchParams.toString()));

  const deleteCouponMutation = useMutation<unknown, TError, number>({
    mutationFn: (id) => axiosInstance.delete(`/admin/coupon/delete?couponId=${id}`),
    onSuccess: () => {
      alert("쿠폰이 삭제되었습니다");
      queryClient.invalidateQueries(admin.qnas.pages(searchParams.toString()));
    },
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
      title: "삭제",
      render: (_, { id }) => (
        <Button
          onClick={() => {
            if (!window.confirm("해당 QnA를 삭제하시겠습니까?")) return;
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
      <Table<ICoupon>
        scroll={{ y: 550 }}
        title={() => "QnA관리"}
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
      {selectedQnAId !== null && (
        <QnAModal
          id={selectedQnAId}
          setSelectedQnAId={setSelectedQnAId}
          title="QnA 답변"
          footer={null}
          onCancel={() => setSelectedQnAId(null)}
        />
      )}
    </Flex>
  );
};

export default Page;
