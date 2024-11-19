import user from "@/queryKeys/user.ts";
import getRandomProdcutImage from "@/utils/getRandomProdcutImage";
import { useQueries } from "@tanstack/react-query";
import { Button, Col, Divider, Flex, Row, Typography } from "antd";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Page: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const queries = useQueries({
    queries: [user.order.detail(id), user.shipping.detail(id)],
  });

  useEffect(() => {
    if (queries.some(({ isError }) => isError)) {
      alert("해당 상품을 찾을 수 없습니다");
      navigate(-1);
    }
  }, [queries]);

  const [{ data: orderDetail }, { data: shippingDetail }] = queries;

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
        {orderDetail.products.map(({ productId, price }) => (
          <Flex key={productId} className="flex-col flex-grow border border-gray-200 p-4">
            <Flex className="justify-between items-center">
              <img
                className="rounded"
                width="80"
                height="80"
                alt="img"
                src={getRandomProdcutImage()}
              />
            </Flex>
            <Divider />
            <Flex className="justify-between">
              <Typography>
                {new Intl.NumberFormat("ko-KR", {
                  style: "currency",
                  currency: "KRW",
                }).format(price)}
              </Typography>
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
          <Button>환불</Button>
          <Button>교체</Button>
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
