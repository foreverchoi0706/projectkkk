"use client";
import { useQuery } from "@tanstack/react-query";
import { Button, Flex, Modal, Table, TableProps } from "antd";
import { FC, useState } from "react";

import queryKeyStore from "@/app/_utils/queryKeyStore";
import { Member } from "@/app/_utils/types";

const columns: TableProps<Member>["columns"] = [
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
    render: () => <Button type="primary">수정</Button>,
    title: "수정",
  },
];

const View: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: members, isLoading } = useQuery({
    ...queryKeyStore.members.all(),
  });
  if (isLoading) return null;
  return (
    <Flex vertical gap="middle">
      {isOpen && (
        <Modal
          title="회원 등록"
          open={isOpen}
          footer={null}
          okButtonProps={{}}
          onCancel={() => setIsOpen(false)}
        ></Modal>
      )}
      <Flex gap="middle">
        <Button type="primary" onClick={() => setIsOpen(true)}>
          등록
        </Button>
      </Flex>
      <Table columns={columns} dataSource={members} />
    </Flex>
  );
};

export default View;
