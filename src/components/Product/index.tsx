import user from "@/queryKeys/user";
import axiosInstance from "@/utils/axiosInstance";
import { IProduct, TError } from "@/utils/types";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Flex, Typography } from "antd";
import { FC, MouseEventHandler, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const Product: FC<IProduct> = ({
  id,
  name,
  brand,
  description,
  discountRate,
  price,
  imageUrl,
  liked,
}) => {
  const src = useMemo(() => {
    const imagePaths = [
      "https://cf.product-image.s.zigzag.kr/original/d/2024/11/11/3887_202411111613170833_42924.jpeg?width=400&height=400&quality=80&format=jpeg",
      "https://cf.product-image.s.zigzag.kr/original/d/2024/10/29/25938_202410290925530134_28014.gif?width=400&height=400&quality=80&format=jpeg",
      "https://cf.product-image.s.zigzag.kr/original/d/2024/11/4/25938_202411041305120961_14186.gif?width=400&height=400&quality=80&format=jpeg",
      "https://cf.product-image.s.zigzag.kr/original/d/2024/11/4/25938_202411041311410464_93507.gif?width=400&height=400&quality=80&format=jpeg",
      "https://cf.product-image.s.zigzag.kr/original/d/2024/11/11/3887_202411111613450352_28116.jpeg?width=400&height=400&quality=80&format=jpeg",
      "https://cf.product-image.s.zigzag.kr/original/d/2024/11/1/2833_202411011251590341_91132.gif?width=400&height=400&quality=80&format=jpeg",
      "https://cf.product-image.s.zigzag.kr/original/d/2024/1/30/4600_202401301106380411_71439.gif?width=400&height=400&quality=80&format=jpeg",
      "https://cf.product-image.s.zigzag.kr/original/d/2024/11/5/10213_202411051857430235_14188.jpeg?width=400&height=400&quality=80&format=jpeg",
      "https://cf.product-image.s.zigzag.kr/original/d/2024/11/6/11864_202411060849430590_17808.gif?width=400&height=400&quality=80&format=jpeg",
      "https://cf.product-image.s.zigzag.kr/original/d/2024/9/20/92_202409201508010184_62129.gif?width=400&height=400&quality=80&format=jpeg",
    ];
    return imagePaths[Math.floor(Math.random() * imagePaths.length)];
  }, []);

  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState<boolean>(liked);
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
          <img width="100%" height="100%" loading="lazy" alt={imageUrl} src={src} />
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
