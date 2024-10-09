import { UnorderedListOutlined } from "@ant-design/icons";
import { Button, Carousel, Flex, Typography } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

const Page: FC = () => {
  return (
    <main>
      <Flex className="flex-col gap-4">
        <Carousel>
          <img
            alt="img"
            src="https://cf.image-farm.s.zigzag.kr/original/cms/2024/09/27/202409270520214482_061783.jpg?width=1029&height=1029&quality=100&format=webp&transparent=true"
          />
          <img
            alt="img"
            src="https://cf.image-farm.s.zigzag.kr/original/cms/2024/10/02/202410021202530837_041069.jpg"
          />
          <img
            alt="img"
            src="https://cf.image-farm.s.zigzag.kr/original/cms/2024/10/04/202410040917163324_093565.jpg"
          />
          <img
            alt="img"
            src="https://cf.image-farm.s.zigzag.kr/original/cms/2024/10/02/202410021202530837_041069.jpg"
          />
        </Carousel>
        <Flex className="gap-4 overflow-x-auto">
          <Link to="">
            <Button>
              <UnorderedListOutlined />
            </Button>
            <Typography className="text-center text-xs">카테고리</Typography>
          </Link>
          {[...new Array(10)].map(() => (
            <Link to="/">
              <Button>👖</Button>
              <Typography className="text-center text-xs">바지</Typography>
            </Link>
          ))}
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
