import { Carousel, Flex } from "antd";
import { FC } from "react";

const Page: FC = () => {
  return (
    <main>
      <Flex className="flex-col">
        <Carousel>
          <div>dasds</div>
          <div>dasds</div>
          <div>dasds</div>
        </Carousel>
        <Flex className="gap-4">
          <div>카테고리</div>
          <div>👖</div>
          <div>👖</div>
          <div>👖</div>
          <div>👖</div>
          <div>👖</div>
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
