import user from "@/queryKeys/user.ts";
import axiosInstance from "@/utils/axiosInstance";
import { DELIVERY_STATUS_TYPE } from "@/utils/constants";
import getRandomProductImage from "@/utils/getRandomProductImage";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Divider, Flex, Row, Typography } from "antd";
import { type FC, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Page: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const src = useMemo<string>(getRandomProductImage, []);

  const [
    { data: orderDetail, isError: isOrderDetailError },
    { data: shippingDetail, isError: isShippingDetailError },
  ] = useQueries({
    queries: [user.order.detail(id), user.shipping.detail(id)],
  });

  const confirmMutation = useMutation({
    mutationFn: () => axiosInstance.post(`/order/confirm?orderId=${id}`),
    onSuccess: () => {
      alert("구매확정되었습니다.");
      queryClient.invalidateQueries(user.order.detail(id));
      queryClient.invalidateQueries(user.shipping.detail(id));
    },
  });
  const refundMutation = useMutation({
    mutationFn: () => axiosInstance.post(`/order/refund?shippingId=${id}`),
    onSuccess: () => {
      alert("반품신청되었습니다.");
      queryClient.invalidateQueries(user.order.detail(id));
      queryClient.invalidateQueries(user.shipping.detail(id));
    },
  });
  const changeMutation = useMutation({
    mutationFn: () => axiosInstance.post(`/order/change?shippingId=${id}`),
    onSuccess: () => {
      alert("교환신청되었습니다.");
      queryClient.invalidateQueries(user.order.detail(id));
      queryClient.invalidateQueries(user.shipping.detail(id));
    },
  });
  const cancelMutation = useMutation({
    mutationFn: () => axiosInstance.delete(`/order/cancel?orderId=${id}`),
    onSuccess: () => {
      alert("주문취소되었습니다.");
      queryClient.invalidateQueries(user.order.detail(id));
      queryClient.invalidateQueries(user.shipping.detail(id));
    },
  });

  const isDisabled = useMemo<boolean>(
    () =>
      shippingDetail?.deliveryStatusType === DELIVERY_STATUS_TYPE.ORDER_REQUESTED ||
      cancelMutation.isPending ||
      refundMutation.isPending ||
      changeMutation.isPending ||
      cancelMutation.isPending,
    [
      shippingDetail?.deliveryStatusType,
      cancelMutation.isPending,
      refundMutation.isPending,
      changeMutation.isPending,
      cancelMutation.isPending,
    ],
  );

  useEffect(() => {
    if (isOrderDetailError || isShippingDetailError) {
      alert("해당 상품을 찾을 수 없습니다");
      navigate(-1);
    }
  }, [isOrderDetailError, isShippingDetailError]);

  if (!orderDetail || !shippingDetail) return null;

  return (
    <main>
      <Flex className="flex-col gap-4">
        <Row gutter={16}>
          <Col span={12}>
            <Flex className="justify-between items-center">
              <Typography className="text-lg">주문번호</Typography>
              <Typography>{orderDetail.orderNum}</Typography>
            </Flex>
          </Col>
        </Row>
        <Divider className="border-t-8" />
        {orderDetail.products.map(({ productId, price, quantity }) => (
          <Flex key={productId} className="flex-col flex-grow border border-gray-200 p-4">
            <Flex className="justify-between items-center">
              <img className="rounded" width="80" height="80" alt="img" src={src} />
            </Flex>
            <Divider />
            <Flex className="justify-between">
              <Typography>
                {new Intl.NumberFormat("ko-KR", {
                  style: "currency",
                  currency: "KRW",
                }).format(price)}
              </Typography>
              <Typography>수량 : {quantity}</Typography>
            </Flex>
          </Flex>
        ))}
        <Divider className="border-t-8" />
        <Flex className="flex-col gap-4">
          <Flex className="justify-between items-center">
            <Typography className="text-lg">주문자메일</Typography>
            <Typography>{shippingDetail.memberEmail}</Typography>
          </Flex>
          <Flex className="justify-between items-center">
            <Typography className="text-lg">배송형태</Typography>
            <Typography>{shippingDetail.deliveryType}</Typography>
          </Flex>
          <Flex className="justify-between items-center">
            <Typography className="text-lg">배송상태</Typography>
            <Typography>{shippingDetail.deliveryStatusType}</Typography>
          </Flex>
          <Flex className="justify-between items-center">
            <Typography className="text-lg">배송비</Typography>
            <Typography>
              {new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
              }).format(shippingDetail.deliveryCost)}
            </Typography>
          </Flex>
          <Flex className="justify-between items-center">
            <Typography className="text-lg">주문일시</Typography>
            <Typography>
              {new Intl.DateTimeFormat("ko-KR").format(new Date(shippingDetail.orderDate))}
            </Typography>
          </Flex>
          <Flex className="justify-between items-center">
            <Typography className="text-lg">출발일시</Typography>
            <Typography>
              {shippingDetail.departureDate
                ? new Intl.DateTimeFormat("ko-KR").format(new Date(shippingDetail.departureDate))
                : "-"}
            </Typography>
          </Flex>
          <Flex className="justify-between items-center">
            <Typography className="text-lg">도착일시</Typography>
            <Typography>
              {shippingDetail.arrivedDate
                ? new Intl.DateTimeFormat("ko-KR").format(new Date(shippingDetail.arrivedDate))
                : "-"}
            </Typography>
          </Flex>
          <Flex className="justify-between items-center">
            <Typography className="text-lg">배송지</Typography>
            <Typography>{shippingDetail.deliveryAddress}</Typography>
          </Flex>
          <Flex className="justify-between items-center">
            <Typography className="text-lg">총 결제금액</Typography>
            <Typography>
              {new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
              }).format(shippingDetail.totalAmount)}
            </Typography>
          </Flex>
        </Flex>
        <Flex className="gap-4">
          <Button
            disabled={isDisabled}
            type="primary"
            onClick={() => {
              if (window.confirm("구매확정하시겠습니까?")) confirmMutation.mutate();
            }}
            className="flex-grow"
          >
            구매확정
          </Button>
          <Button
            disabled={isDisabled}
            className="flex-grow"
            onClick={() => {
              if (window.confirm("반품신청하시겠습니까?")) refundMutation.mutate();
            }}
            htmlType="button"
          >
            반품신청
          </Button>
          <Button
            disabled={isDisabled}
            className="flex-grow"
            onClick={() => {
              if (window.confirm("교환신청하시겠습니까?")) changeMutation.mutate();
            }}
            htmlType="button"
          >
            교환신청
          </Button>
          <Button
            disabled={isDisabled}
            className="flex-grow"
            onClick={() => {
              if (window.confirm("주문취소하시겠습니까?")) cancelMutation.mutate();
            }}
            htmlType="button"
          >
            주문취소
          </Button>
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
