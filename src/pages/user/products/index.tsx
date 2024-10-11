import { HeartFilled } from "@ant-design/icons";
import { Flex } from "antd";
import { FC } from "react";

const Page: FC = () => {
  return (
    <main>
      <Flex>
        <img
          className="rounded"
          src="https://cf.image-farm.s.zigzag.kr/original/cms/2024/10/04/202410040917163324_093565.jpg"
          alt="item"
        />
        <HeartFilled />
      </Flex>
    </main>
  );
};

export default Page;
