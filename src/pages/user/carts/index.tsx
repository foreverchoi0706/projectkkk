import Product from "@/components/Product";
import user from "@/queryKeys/user";
import axiosInstance from "@/utils/axiosInstance.ts";
import type { TError } from "@/utils/types.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Divider, Flex, Row, Typography } from "antd";
import type { FC } from "react";
import { Link } from "react-router-dom";

const Page: FC = () => {
  const queryClient = useQueryClient();
  const { data: cartPages } = useQuery(user.cart.pages());
  const { data: newProducts } = useQuery(user.products.new(1));

  const deleteCartMutation = useMutation<unknown, TError, number>({
    mutationFn: (cartId) => axiosInstance.delete(`/cart/delete?cartId=${cartId}`),
    onSuccess: () =>
      queryClient
        .invalidateQueries({
          queryKey: user.cart.pages().queryKey,
        })
        .then(() => alert("장바구니에서 삭제되었습니다")),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onClickDeleteCart = (cartId: number) => {
    if (!window.confirm("해당 상품을 장바구니에서 삭제하시겠습니까?")) return;
    deleteCartMutation.mutate(cartId);
  };

  if (!cartPages) return null;

  return (
    <main>
      {cartPages.content.length > 0 ? (
        <Flex className="flex-col gap-8">
          <Typography className="font-bold text-xl">장바구니</Typography>
          <Row gutter={[8, 8]}>
            {cartPages.content.map((cart) => (
              <Col xs={12} md={8} key={cart.id}>
                <Product {...cart} />
                <Button className="w-full" onClick={() => onClickDeleteCart(cart.id)}>
                  장바구니에서 삭제
                </Button>
              </Col>
            ))}
          </Row>
        </Flex>
      ) : (
        <Flex className="flex-col justify-center items-center gap-8 p-8">
          <Typography className="font-bold text-xl">장바구니</Typography>
          <Typography className="ext-center font-bold text-2xl">
            장바구니에 담긴 상품이 없어요
          </Typography>
          <Typography className="text-lg">원하는 상품을 담아보세요</Typography>
          <Link to="/search">
            <Button variant="solid" color="primary">
              상품보러가기
            </Button>
          </Link>
        </Flex>
      )}
      <Divider className="border-t-8" />
      <Flex className="flex-col gap-8">
        <Typography className="font-bold text-xl">함께 구매하면 좋은 상품</Typography>
        <Row gutter={[8, 8]}>
          {newProducts?.content.map((product) => (
            <Col xs={12} md={8} key={product.id}>
              <Product {...product} />
            </Col>
          ))}
        </Row>
      </Flex>
    </main>
  );
};

export default Page;
