import useLike from "@/hooks/useLike.ts";
import getRandomProductImage from "@/utils/getRandomProductImage";
import type { IProduct } from "@/utils/types";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import { type FC, type MouseEventHandler, useMemo } from "react";
import { Link } from "react-router-dom";

const Product: FC<Partial<IProduct> & { deletable?: boolean }> = ({
  id,
  name,
  brand,
  description,
  discountRate,
  price,
  liked,
  mainImageFile,
}) => {
  const src = useMemo<string>(() => mainImageFile || getRandomProductImage(), [mainImageFile]);
  const { isLiked, likeMutation, unlikeMutation } = useLike(liked || false, id);

  const onClickLike: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.preventDefault();
    const mutation = liked ? unlikeMutation : likeMutation;
    if (mutation.isPending) return;
    mutation.mutate();
  };

  return (
    <Link className="block" to={`/products/${id}`}>
      <Flex className="h-full flex-col">
        <Flex className="relative flex-grow">
          <img
            className="w-full h-full md:w-[188px] md:h-[255px]"
            loading="lazy"
            alt="product"
            src={src}
          />
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
              }).format(price || 0)}
            </Typography>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Product;
