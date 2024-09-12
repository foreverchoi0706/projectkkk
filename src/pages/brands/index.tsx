import { DEFAULT_LIST_PAGE_SIZE } from "@/utils/constants.ts";
import queryKeys from "@/utils/queryKeys.ts";
import { useQuery } from "@tanstack/react-query";
import { Flex, Spin, Table, TableProps } from "antd";
import { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log(searchParams.toString());
  
  const { data: brands } = useQuery({
    ...queryKeys.brands.all(searchParams.toString()),
    select : (data) => ({
        ...data,
        content : data.content.map((brand)=>({
            name : brand
        }))
    })
  });

  if (!brands) return <Spin />;
  const columns: TableProps<{  name: string }>["columns"] = [
    {
      align: "center",
      dataIndex: "name",
      key: "name",
      title: "name",
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Table<{ name: string }>
        title={() => "브랜드관리"}
        rowKey={({name})=>name}
        columns={columns}
        locale={{
          emptyText: "검색결과가 없습니다",
        }}
        dataSource={brands.content}
        pagination={{
          onChange: (page) => navigate(`/brands?page=${page}`, { replace: true }),
          pageSize: +DEFAULT_LIST_PAGE_SIZE,
          current: brands.page + 1,
          total: brands.totalCount,
          showSizeChanger: false,
        }}
      />
    </Flex>
  );
};

export default Page;
