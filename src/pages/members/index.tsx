import { useQuery } from "@tanstack/react-query";
import { Button, Flex, Form, Input, Spin, Table, TableProps } from "antd";
import { FC, useState } from "react";
import { IMember } from "@/utils/types.ts";
import queryKeys from "@/utils/queryKeys.ts";
import UpsertModal from "@/pages/members/UpsertModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants.ts";

const Page: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>();
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
        onClick: () => {
          console.log(id);
        },
      }),
      render: () => <Button type="primary">상세</Button>,
      title: "상세",
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Form>
        <Flex gap="middle">
          <Form.Item>
            <Input placeholder="멤버아이디" />
          </Form.Item>
          <Form.Item>
            <Input placeholder="이메일" />
          </Form.Item>
          <Form.Item>
            <Button type="primary">검색</Button>
          </Form.Item>
          <Form.Item>
            <Button type="default" onClick={() => setSelectedMemberId(null)}>
              멤버 추가
            </Button>
          </Form.Item>
        </Flex>
      </Form>

      <Table
        title={() => "멤버관리"}
        onRow={(_, rowIndex = 0) => {
          return {
            onClick: () => {
              const member = members.content.at(rowIndex);
              if (member?.id) setSelectedMemberId(member.id);
            },
          };
        }}
        rowKey={({ id }) => id}
        columns={columns}
        dataSource={members.content}
        pagination={{
          onChange: (page) => navigate(`/members?page=${page}`, { replace: true }),
          pageSize: +DEFAULT_LIST_PAGE_SIZE,
          current: members.page,
          total: members.totalCount,
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
