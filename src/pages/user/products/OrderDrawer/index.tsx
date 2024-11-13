import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/utils/axiosInstance";
import { IOrderParams, IProduct, TError } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Drawer,
  Form,
  Flex,
  Typography,
  Button,
  Input,
  DrawerProps,
  FormProps,
  InputRef,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { ChangeEvent, FC, useEffect, useRef } from "react";
import { debounceTime, distinctUntilChanged, fromEvent, map } from "rxjs";
import user from "@/queryKeys/user";

const OrderDrawer: FC<DrawerProps & { product: IProduct }> = ({ product, ...rest }) => {
  const { id, discountRate, price, size, color } = product;
  const { info } = useAuth();
  const refPointInput = useRef<InputRef>(null);
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

  const { data: coupons } = useQuery(user.coupons.all());

  console.log(coupons);

  useEffect(() => {
    if (!product || !rest.open) return;
    orderForm.setFieldValue("productId", id);
    orderForm.setFieldValue("price", price);
    orderForm.setFieldValue("size", size);
    orderForm.setFieldValue("color", color);
  }, [product, rest.open]);

  useEffect(() => {
    if (!refPointInput.current?.input || !rest.open) return;
    const inputEvent = fromEvent<ChangeEvent<HTMLInputElement>>(
      refPointInput.current.input,
      "input",
    )
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map(({ target }) => +target),
      )
      .subscribe((value) => orderForm.setFieldValue("pointsUsed", value));
    return () => inputEvent.unsubscribe();
  }, [rest.open]);

  return (
    <Drawer {...rest}>
      <Form<IOrderParams> form={orderForm} onFinish={onFinishOrder}>
        <Form.Item<IOrderParams> name="size">
          <Flex className="gap-4 flex-col">
            <Typography>사이즈</Typography>
            <Button className="w-fit">{size}</Button>
          </Flex>
        </Form.Item>
        <Form.Item<IOrderParams> name="color">
          <Flex className="gap-4 flex-col">
            <Typography>색상</Typography>
            <Button className="w-fit">{color}</Button>
          </Flex>
        </Form.Item>
        <Form.Item<IOrderParams> name="price">
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
          <Input
            type="number"
            ref={refPointInput}
            placeholder="0"
            addonAfter={`잔여 포인트 : ${info?.point || 0}P`}
            disabled={(info?.point || 0) === 0}
          />
        </Form.Item>
        {coupons && coupons.content.length > 0 && (
          <Form.Item<IOrderParams> name="couponId">
            <Select placeholder="쿠폰">
              {coupons.content.map(({ id, name, startDate, discountRate, endDate }) => (
                <Select.Option key={id}>
                  <Flex key={id} className="flex-col gap-4 p-4 border border-gray-200 rounded">
                    <Flex className="justify-between items-center">
                      <Typography className="font-bold text-lg">{name}</Typography>
                      <Typography className="text-pink-500 text-2xl font-bold">
                        {discountRate}%
                      </Typography>
                    </Flex>
                    <Typography className="text-end font-medium">
                      {new Intl.DateTimeFormat("ko-KR").format(new Date(startDate))}~
                      {new Intl.DateTimeFormat("ko-KR").format(new Date(endDate))}
                    </Typography>
                  </Flex>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item<IOrderParams> name="customMessage">
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
