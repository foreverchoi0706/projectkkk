import user from "@/queryKeys/user.ts";
import { TProductSearchParams } from "@/utils/types";
import { useQueries } from "@tanstack/react-query";
import { Button, Drawer, Flex, Form, Typography } from "antd";
import { DrawerProps } from "antd/es/drawer";
import queryString from "query-string";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const SearchFilterDrawer: FC<DrawerProps> = (props) => {
  const navigate = useNavigate();
  const [searchFilterForm] = Form.useForm<TProductSearchParams>();
  const queries = useQueries({
    queries: [
      { ...user.brands.all(), enabled: props.open },
      { ...user.categories.all(), enabled: props.open },
    ],
  });
  const [{ data: brands }, { data: categories }] = queries;

  const onFinishApplySearchFilter = (productSearchParams: TProductSearchParams) => {
    navigate(`/search?${queryString.stringify(productSearchParams)}`, { replace: true });
  };

  if (queries.every(({ isLoading }) => isLoading)) return null;

  return (
    <Drawer
      styles={{
        content: {
          maxWidth: "600px",
          margin: "0 auto",
        },
        wrapper: {
          boxShadow: "none",
        },
      }}
      {...props}
    >
      <Form<TProductSearchParams> form={searchFilterForm} onFinish={onFinishApplySearchFilter}>
        <Form.Item<TProductSearchParams> name="brand">
          <Flex className="flex-col gap-4 shadow-none">
            <Typography>브랜드</Typography>
            <Flex className="gap-4 overflow-x-auto">
              {brands?.content.map((brand, index) => (
                <Button
                  type={searchFilterForm.getFieldValue("brand") === brand ? "primary" : "default"}
                  onClick={() => searchFilterForm.setFieldValue("brand", brand)}
                  key={index}
                >
                  {brand}
                </Button>
              ))}
            </Flex>
          </Flex>
        </Form.Item>
        <Form.Item<TProductSearchParams> name="category">
          <Flex className="flex-col gap-4">
            <Typography>카테고리</Typography>
            <Flex className="gap-4 overflow-x-auto">
              {categories?.content.map(({ id, name }) => (
                <Button
                  type={searchFilterForm.getFieldValue("category") === id ? "primary" : "default"}
                  onClick={() => searchFilterForm.setFieldValue("category", id)}
                  key={id}
                >
                  {name}
                </Button>
              ))}
            </Flex>
          </Flex>
        </Form.Item>
        <Form.Item<TProductSearchParams>>
          <Flex className="gap-4">
            <Button className="flex-grow" onClick={() => searchFilterForm.resetFields()}>
              재설정
            </Button>
            <Button className="flex-grow" htmlType="submit" type="primary">
              조회하기
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default SearchFilterDrawer;
