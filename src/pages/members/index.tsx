import { useQuery } from "@tanstack/react-query";
import { Button, Flex, Form, Input, Spin, Table, TableProps } from "antd";
import { FC, useState } from "react";
import { IMember, IMemberSearchParams } from "@/utils/types.ts";
import queryKeys from "@/utils/queryKeys.ts";
import UpsertModal from "@/pages/members/UpsertModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants.ts";

const Page: FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<IMemberSearchParams>();
  const [searchParams] = useSearchParams();
  const [selectedMemberId, setSelectedMemberId] = useState<number>();
  const isOpen = selectedMemberId !== undefined;
  const { data: members } = useQuery(queryKeys.members.all(searchParams.toString()));
  if (!members) return <Spin />;
  const columns: TableProps<IMember>["columns"] = [
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
      title: "회원번호",
    },
    {
      align: "center",
      dataIndex: "name",
      key: "name",
      title: "회원명",
    },
    {
      align: "center",
      dataIndex: "phone",
      key: "phone",
      title: "전화번호",
    },
    {
      align: "center",
      dataIndex: "email",
      key: "email",
      title: "이메일",
    },
    {
      dataIndex: "update",
      key: "update",
      onCell: ({ id }) => ({
        onClick: () => setSelectedMemberId(id),
      }),
      render: () => <Button type="primary">상세</Button>,
      title: "상세",
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Form<IMemberSearchParams> form={form}>
        <Flex gap="middle">
          <Form.Item<IMemberSearchParams> name="id">
            <Input placeholder="멤버아이디" />
          </Form.Item>
          <Form.Item<IMemberSearchParams> name="email">
            <Input placeholder="이메일" />
          </Form.Item>
          <Form.Item>
            <Button type="primary">검색</Button>
          </Form.Item>
        </Flex>
      </Form>

      <Table<IMember>
        title={() => "멤버관리"}
        rowKey={({ id }) => id}
        columns={columns}
        dataSource={members.content}
        pagination={{
          onChange: (page) => navigate(`/members?page=${page}`, { replace: true }),
          pageSize: +DEFAULT_LIST_PAGE_SIZE,
          current: members.page,
          total: members.totalCount,
          showSizeChanger: false,
        }}
      />
      {isOpen && (
        <UpsertModal
          open={isOpen}
          footer={null}
          memberId={selectedMemberId}
          setSelectedMemberId={setSelectedMemberId}
          onCancel={() => setSelectedMemberId(undefined)}
          queryString={searchParams.toString()}
        />
      )}
    </Flex>
  );
};

export default Page;
