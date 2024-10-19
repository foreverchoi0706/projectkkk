import { IProduct } from "@/utils/types";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

interface IProps extends IProduct {}

const Product: FC<IProps> = ({ id, name, brand, description, discountRate, price, imageUrl }) => {
  return (
    <Link to={`/products/${id}`}>
      <Flex className="w-fit relative">
        <img
          className="w-[200px] h-[200px]"
          loading="lazy"
          alt={imageUrl}
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
      <Flex className="flex-col p-2">
        <Typography className="font-bold">{name}</Typography>
        <Typography className="font-medium">
          [{brand}] {description}
        </Typography>
        <Flex className="justify-between items-center">
          <Typography className="font-medium text-lg text-pink-500">{discountRate}%</Typography>
          <Typography className="font-medium text-lg">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
            }).format(price)}
          </Typography>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Product;
