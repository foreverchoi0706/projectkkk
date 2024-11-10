import user from "@/queryKeys/user.ts";
import { useQueries } from "@tanstack/react-query";
import { Button, Drawer, Flex, Form, Typography } from "antd";
import { DrawerProps } from "antd/es/drawer";
import { FC } from "react";

const SearchFilterDrawer: FC<DrawerProps> = (props) => {
  const queries = useQueries({
    queries: [
      { ...user.brands.all(), enabled: props.open },
      { ...user.categories.all(), enabled: props.open },
    ],
  });

  if (queries.every(({ isLoading }) => isLoading)) return null;

  const [{ data: brands }, { data: categories }] = queries;

  return (
    <Drawer
      classNames={{
        content: "max-w-[600px] my-0 mx-auto rounded",
      }}
      {...props}
    >
      <Form>
        <Form.Item>
          <Flex className="flex-col gap-4 shadow-none">
            <Typography>브랜드</Typography>
            <Flex className="gap-4 overflow-x-auto">
              {brands?.content.map((brand, index) => (
                <Button key={index}>{brand}</Button>
              ))}
            </Flex>
          </Flex>
        </Form.Item>
        <Form.Item>
          <Flex className="flex-col gap-4">
            <Typography>카테고리</Typography>
            <Flex className="gap-4 overflow-x-auto">
              {categories?.content.map(({ id, name }) => (
                <Button key={id}>{name}</Button>
              ))}
            </Flex>
          </Flex>
        </Form.Item>
        <Form.Item>
          <Flex className="gap-4 ">
            <Button className="flex-grow">재설정</Button>
            <Button className="flex-grow" type="primary">
              조회하기
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default SearchFilterDrawer;
