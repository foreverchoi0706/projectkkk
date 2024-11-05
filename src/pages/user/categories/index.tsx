import user from "@/queryKeys/user";
import { ICategory } from "@/utils/types";
import { RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Flex, Row, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Page: FC = () => {
  const navigate = useNavigate();
  const { data: categories } = useQuery(user.category.all());
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const onClickCategoryMenu = (categoryId: number) => {
    if (!categories) return;
    const category = categories.content.find(({ id }) => id === categoryId)!;
    setSelectedCategory(category);
  };

  const onClickCategory = (code: string) => {
    navigate(`/search?category=${code}`);
  };

  useEffect(() => {
    if (!categories) return;
    setSelectedCategory(categories.content[0]);
  }, [categories]);

  if (!categories || !selectedCategory) return null;
  return (
    <main className="h-full">
      <Flex className="h-full">
        <Flex className="bg-gray-200 flex-col gap-4">
          {categories.content.map(({ name, id }) => (
            <Button key={id} onClick={() => onClickCategoryMenu(id)} type="text">
              {name}
            </Button>
          ))}
        </Flex>
        <Flex className="flex-col flex-grow p-4 gap-4">
          <Flex
            className="cursor-pointer w-full justify-between"
            onClick={() => onClickCategory(selectedCategory.code)}
          >
            <Typography className="font-bold text-lg ">{selectedCategory.name}</Typography>
            <Typography className="font-bold text-lg">
              <RightOutlined />
            </Typography>
          </Flex>
          <Row gutter={[8, 8]}>
            {selectedCategory.children.map(({ id, name, code }) => (
              <Col key={id} span={12}>
                <Flex
                  className="cursor-pointer justify-between"
                  onClick={() => onClickCategory(code)}
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
