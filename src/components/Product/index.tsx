import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

const Product: FC = () => {
  return (
    <Link to="/products">
      <Flex className="relative">
        <img
          className="rounded"
          width={180}
          height={300}
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
    </Link>
  );
};

export default Product;
