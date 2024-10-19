import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

interface IProps {
  id: number;
}

const Product: FC<IProps> = ({ id }) => {
  return (
    <Link to={`/products/${id}`}>
      <Flex className="w-fit relative">
        <img
          className="w-[200px] h-[200px]"
          loading="lazy"
          alt="img"
          src="https://cf.image-farm.s.zigzag.kr/original/cms/2024/10/04/202410040917163324_093565.jpg"
        />
        <HeartOutlined
          onClick={(e) => e.preventDefault()}
          className="text-red-50 absolute bottom-2 right-2 text-xl"
        />
        <HeartFilled
          onClick={(e) => e.preventDefault()}
          className="text-red-500 absolute bottom-2 right-2 text-xl"
        />
      </Flex>
      <Flex className="flex-col ">
        <Typography>제목</Typography>
        <Typography>설명</Typography>
      </Flex>
    </Link>
  );
};

export default Product;
