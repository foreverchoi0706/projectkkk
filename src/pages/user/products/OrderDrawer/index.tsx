import axiosInstance from "@/utils/axiosInstance";
import { IOrderParams, IProduct, TError } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { Drawer, Form, Flex, Typography, Button, Input, DrawerProps, FormProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC, useEffect } from "react";

const OrderDrawer: FC<DrawerProps & { product: IProduct }> = ({ product, ...rest }) => {
  const [orderForm] = Form.useForm<IOrderParams>();

  const orderMutation = useMutation<unknown, TError, IOrderParams>({
    mutationFn: (orderParams) => axiosInstance.post(`/order/join`, orderParams),
    onSuccess: console.log,
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onFinishOrder: FormProps<IOrderParams>["onFinish"] = (orderParams) => {
    console.log(orderParams);
    orderMutation.mutate(orderParams);
  };

  useEffect(() => {
    if (!product) return;
    orderForm.setFieldValue("productOrders", [
      {
        productId: product.id,
        price: product.price,
        size: product.size,
        color: product.color,
      },
    ]);
  }, [product]);

  const { discountRate, price, size, color } = product;

  return (
    <Drawer {...rest}>
      <Form<IOrderParams> form={orderForm} onFinish={onFinishOrder}>
        <Form.Item<IOrderParams>>
          <Flex className="gap-4 flex-col">
            <Typography>사이즈</Typography>
            <Button className="w-fit">{size}</Button>
          </Flex>
        </Form.Item>
        <Form.Item<IOrderParams>>
          <Flex className="gap-4 flex-col">
            <Typography>색상</Typography>
            <Button className="w-fit">{color}</Button>
          </Flex>
        </Form.Item>
        <Form.Item<IOrderParams>>
          <Flex className="gap-2 items-center">
            <Typography className="line-through">
              {new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
              }).format(price)}
            </Typography>
            <Typography className="font-bold text-3xl text-pink-500">
              {new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
              }).format(Math.round((price * (100 - discountRate)) / 100))}
            </Typography>
          </Flex>
        </Form.Item>
        <Form.Item<IOrderParams>>
          <Input placeholder="포인트" />
        </Form.Item>
        <Form.Item<IOrderParams>>
          <TextArea placeholder="배송시 메모" />
        </Form.Item>
        <Form.Item<IOrderParams>>
          <Flex className="gap-4 flex-col">
            <Button htmlType="submit" type="primary">
              바로 구매
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default OrderDrawer;
