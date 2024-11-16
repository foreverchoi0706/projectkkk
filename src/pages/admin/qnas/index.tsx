import admin from "@/queryKeys/admin";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants";
import { IQnaWating } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Flex, Spin, Table, TableProps } from "antd";
import { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: brands } = useQuery(admin.qnas.pages(searchParams.toString()));

  if (!brands) return <Spin />;
  const columns: TableProps<IQnaWating>["columns"] = [
    {
      align: "center",
      dataIndex: "id",
      key: "id",
      title: "id",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "qnAType",
      key: "qnAType",
      title: "qnAType",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "subject",
      key: "subject",
      title: "subject",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "productNum",
      key: "productNum",
      title: "productNum",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "orderNum",
      key: "orderNum",
      title: "orderNum",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "description",
      key: "description",
      title: "description",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "memberEmail",
      key: "memberEmail",
      title: "memberEmail",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "createAt",
      key: "createAt",
      title: "createAt",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answer",
      key: "answer",
      title: "answer",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answerDate",
      key: "answerDate",
      title: "answerDate",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answererEmail",
      key: "answererEmail",
      title: "answererEmail",
      render: (value) => <>{value || "-"}</>,
    },
    {
      align: "center",
      dataIndex: "answerStatus",
      key: "answerStatus",
      title: "answerStatus",
      render: (value) => <>{value || "-"}</>,
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Table<IQnaWating>
        scroll={{ y: 550 }}
        title={() => "QnA관리"}
        rowKey={({ id }) => id}
        columns={columns}
        locale={{ emptyText: "검색결과가 없습니다" }}
        dataSource={brands.content}
        pagination={{
          onChange: (page) => navigate(`/admin/qnas?page=${page}`, { replace: true }),
          pageSize: DEFAULT_LIST_PAGE_SIZE,
          current: brands.page + 1,
          total: brands.totalCount,
          showSizeChanger: false,
        }}
      />
    </Flex>
  );
};

export default Page;
