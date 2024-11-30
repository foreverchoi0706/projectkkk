import useLike from "@/hooks/useLike.ts";
import getRandomProductImage from "@/utils/getRandomProductImage";
import type { IProduct } from "@/utils/types";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import { type FC, type MouseEventHandler, useMemo } from "react";
import { Link } from "react-router-dom";

const Product: FC<IProduct> = ({ id, name, brand, description, discountRate, price, liked }) => {
  const src = useMemo<string>(getRandomProductImage, []);
  const { isLiked, likeMutation, unlikeMutation } = useLike(liked, id);

  const onClickLike: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.preventDefault();
    const mutation = liked ? unlikeMutation : likeMutation;
    if (mutation.isPending) return;
    mutation.mutate();
  };

  return (
    <Link className="h-full block" to={`/products/${id}`}>
      <Flex className="h-full flex-col">
        <Flex className="relative flex-grow">
          <img width="100%" height="100%" loading="lazy" alt="product" src={src} />
          {isLiked ? (
            <HeartFilled
              disabled
              onClick={onClickLike}
              className="text-pink-500 absolute bottom-2 right-2 text-xl"
            />
          ) : (
            <HeartOutlined
              onClick={onClickLike}
              className="text-pink-500 absolute bottom-2 right-2 text-xl"
            />
          )}
        </Flex>
        <Flex className="flex-col p-2">
          <Typography className="font-bold">{name}</Typography>
          <Typography className="font-medium text-ellipsis overflow-hidden text-nowrap">
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
      </Flex>
    </Link>
  );
};

export default Product;
