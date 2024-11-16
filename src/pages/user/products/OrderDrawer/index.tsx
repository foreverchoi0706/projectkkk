import useAuth from "@/hooks/useAuth";
import user from "@/queryKeys/user";
import axiosInstance from "@/utils/axiosInstance";
import { DELIVERY_ADDRESS_TYPE, DELIVERY_TYPE, SHIPPING_MESSAGES } from "@/utils/constants";
import {
  IOrderParams,
  IProduct,
  TDeliveryAddressType,
  TError,
  TShippingMessages,
} from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Drawer,
  DrawerProps,
  Flex,
  Form,
  FormProps,
  Input,
  Select,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC, useEffect } from "react";

const OrderDrawer: FC<DrawerProps & { product: IProduct }> = ({ product, ...rest }) => {
  const { id, discountRate, price, size, color } = product;
  const { info } = useAuth();
  const queryCient = useQueryClient();
  const [orderForm] = Form.useForm<IOrderParams>();
  const deliveryAddressType = Form.useWatch<TDeliveryAddressType>("deliveryAddressType", orderForm);
  const shippingMessages = Form.useWatch<TShippingMessages>("shippingMessages", orderForm);
  const orderMutation = useMutation<unknown, TError, unknown>({
    mutationFn: (orderParams) => axiosInstance.post(`/order/join`, orderParams),
    onSuccess: () => {
      queryCient.invalidateQueries({
        queryKey: user.shipping._def,
      });
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onFinishOrder: FormProps<IOrderParams>["onFinish"] = (orderParams) => {
    orderMutation.mutate({
      productOrders: [
        {
          productId: product.id,
          price: orderParams.price,
          quantity: 0,
        },
      ],
      shippingInfo: {
        deliveryType: orderParams.deliveryType,
        deliveryAddressType: orderParams.deliveryAddressType,
        deliveryAddress: orderParams.deliveryAddress || "",
        shippingMessages: orderParams.shippingMessages,
        customMessage: orderParams.customMessage || "",
      },
      pointsUsed: orderParams.pointsUsed,
      couponId: orderParams.couponId,
    });
  };

  const { data: coupons } = useQuery(user.coupons.all());

  useEffect(() => {
    if (!product || !rest.open) return;
    orderForm.setFieldValue("productId", id);
    orderForm.setFieldValue("price", price);
    orderForm.setFieldValue("size", size);
    orderForm.setFieldValue("color", color);
    orderForm.setFieldValue("pointsUsed", 0);
  }, [product, rest.open]);

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
        <Form.Item<IOrderParams>
          name="pointsUsed"
          rules={[
            {
              validator(_, value) {
                console.log(value, info?.point);
                if ((info?.point || 0) < value)
                  return Promise.reject("사용 포인트는 잔여 포인트보다 많을 수 없습니다");
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            placeholder={`${info?.point || 0}`}
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
        <Form.Item<IOrderParams>
          name="deliveryAddressType"
          rules={[
            {
              required: true,
              message: "기본 배송지를 입력해주세요",
            },
          ]}
        >
          <Select placeholder="배송지">
            <Select.Option value={DELIVERY_ADDRESS_TYPE.DEFAULT_ADDRESS}>
              {DELIVERY_ADDRESS_TYPE.DEFAULT_ADDRESS}
            </Select.Option>
            <Select.Option value={DELIVERY_ADDRESS_TYPE.NEW_ADDRESS}>
              {DELIVERY_ADDRESS_TYPE.NEW_ADDRESS}
            </Select.Option>
          </Select>
        </Form.Item>
        {deliveryAddressType === DELIVERY_ADDRESS_TYPE.NEW_ADDRESS && (
          <Form.Item<IOrderParams>
            name="deliveryAddress"
            rules={[
              {
                required: true,
                message: "새 배송지를 입력해주세요",
              },
            ]}
          >
            <Input placeholder="새 배송지" />
          </Form.Item>
        )}
        <Form.Item<IOrderParams>
          name="deliveryType"
          rules={[
            {
              required: true,
              message: "배송 형태를 입력해주세요",
            },
          ]}
        >
          <Select placeholder="배송형태">
            <Select.Option value={DELIVERY_TYPE.STRAIGHT_DELIVERY}>
              {DELIVERY_TYPE.STRAIGHT_DELIVERY}
            </Select.Option>
            <Select.Option value={DELIVERY_TYPE.ORDINARY_DELIVERY}>
              {DELIVERY_TYPE.ORDINARY_DELIVERY}
            </Select.Option>
            <Select.Option value={DELIVERY_TYPE.REMOTE_DELIVERY}>
              {DELIVERY_TYPE.REMOTE_DELIVERY}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item<IOrderParams>
          name="shippingMessages"
          rules={[
            {
              required: true,
              message: "배송시 메모를 입력해주세요",
            },
          ]}
        >
          <Select placeholder="배송시 메모">
            <Select.Option value={SHIPPING_MESSAGES.LEAVE_AT_DOOR}>
              {SHIPPING_MESSAGES.LEAVE_AT_DOOR}
            </Select.Option>
            <Select.Option value={SHIPPING_MESSAGES.DIRECT_HANDOFF}>
              {SHIPPING_MESSAGES.DIRECT_HANDOFF}
            </Select.Option>
            <Select.Option value={SHIPPING_MESSAGES.LEAVE_WITH_CONCIERGE}>
              {SHIPPING_MESSAGES.LEAVE_WITH_CONCIERGE}
            </Select.Option>
            <Select.Option value={SHIPPING_MESSAGES.CONTACT_BEFORE_DELIVERY}>
              {SHIPPING_MESSAGES.CONTACT_BEFORE_DELIVERY}
            </Select.Option>
            <Select.Option value={SHIPPING_MESSAGES.CUSTOM}>
              {SHIPPING_MESSAGES.CUSTOM}
            </Select.Option>
          </Select>
        </Form.Item>
        {shippingMessages === SHIPPING_MESSAGES.CUSTOM && (
          <Form.Item<IOrderParams>
            name="customMessage"
            rules={[
              {
                required: true,
                message: "요청사항을 입력해주세요",
              },
            ]}
          >
            <TextArea placeholder="요청사항" />
          </Form.Item>
        )}
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
