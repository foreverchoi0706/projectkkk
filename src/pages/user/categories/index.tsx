import user from "@/queryKeys/user.ts";
import { ICategory } from "@/utils/types.ts";
import { RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Flex, Row, Typography } from "antd";
import { FC, useEffect, useState } from "react";

const Page: FC = () => {
  const { data: categories } = useQuery(user.category.all());
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const onClickCategoryMenu = (categoryId: number) => {
    if (!categories) return;
    const category = categories.content.find(({ id }) => id === categoryId)!;
    setSelectedCategory(category);
  };

  const onClickCategory = (categoryId: number) => {
    console.log(categoryId);
  };

  useEffect(() => {
    if (!categories) return;
    setSelectedCategory(categories.content[0]);
  }, [categories]);

  if (!categories || !selectedCategory) return null;
  return (
    <main className="h-full">
      <Flex className="h-full">
        <Flex className="bg-gray-100 flex-col gap-4">
          {categories.content.map(({ name, id }) => (
            <Button key={id} onClick={() => onClickCategoryMenu(id)} type="text">
              {name}
            </Button>
          ))}
        </Flex>
        <Flex className="flex-col flex-grow p-4 gap-4">
          <Flex
            className="cursor-pointer w-full justify-between"
            onClick={() => onClickCategory(selectedCategory.id)}
          >
            <Typography className="font-bold text-lg">{selectedCategory.name}</Typography>
            <Typography className="font-bold text-lg">
              <RightOutlined />
            </Typography>
          </Flex>
          <Row gutter={[8, 8]}>
            {selectedCategory.children.map(({ id, name }) => (
              <Col key={id} span={12}>
                <Flex
                  className="cursor-pointer justify-between"
                  onClick={() => onClickCategory(id)}
                >
                  <Typography>{name}</Typography>
                  <Typography>
                    <RightOutlined />
                  </Typography>
                </Flex>
              </Col>
            ))}
          </Row>
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
