import user from "@/queryKeys/user";
import axiosInstance from "@/utils/axiosInstance";
import getRandomProdcutImage from "@/utils/getRandomProdcutImage";
import { IProduct, TError } from "@/utils/types";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Flex, Typography } from "antd";
import { FC, MouseEventHandler, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const Product: FC<IProduct> = ({ id, name, brand, description, discountRate, price, liked }) => {
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const src = useMemo(getRandomProdcutImage, []);
  const likeMutation = useMutation<unknown, TError>({
    mutationFn: () => axiosInstance.post(`/wishList/add?productId=${id}`),
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries(user.products.wish());
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const unlikeMutation = useMutation<unknown, TError>({
    mutationFn: () => axiosInstance.delete(`/wishList/remove?productId=${id}`),
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries(user.products.wish());
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onClickLike: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.preventDefault();
    const mutation = liked ? unlikeMutation : likeMutation;
    if (mutation.isPending) return;
    mutation.mutate();
  };

  return (
    <Link className="h-full block" to={`/products/${id}`}>
      <Flex className="h-full flex-col">
        <Flex className="w-fit relative flex-grow">
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
