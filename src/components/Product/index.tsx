import { axiosInstance } from "@/queryKeys/admin.ts";
import { IProduct, TError } from "@/utils/types";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Flex, Typography } from "antd";
import { FC, MouseEventHandler, useState } from "react";
import { Link } from "react-router-dom";

interface IProps extends IProduct {}

const Product: FC<IProps> = ({
  id,
  name,
  brand,
  description,
  discountRate,
  price,
  imageUrl,
  liked,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const likeMutation = useMutation<unknown, TError, boolean>({
    mutationFn: (liked: boolean) => axiosInstance.post(`/wishList/toggle/${id}?liked=${liked}`),
    onSuccess: () => setIsLiked(!isLiked),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onClickLike: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.preventDefault();
    likeMutation.mutate(!liked);
  };

  return (
    <Link to={`/products/${id}`}>
      <Flex className="w-fit relative">
        <img
          width="100%"
          loading="lazy"
          alt={imageUrl}
          src="https://cf.image-farm.s.zigzag.kr/original/cms/2024/10/04/202410040917163324_093565.jpg"
        />
        {isLiked ? (
          <HeartFilled
            onClick={onClickLike}
            className="text-red-500 absolute bottom-2 right-2 text-xl"
          />
        ) : (
          <HeartOutlined
            onClick={onClickLike}
            className="text-red-500 absolute bottom-2 right-2 text-xl"
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
    </Link>
  );
};

export default Product;
