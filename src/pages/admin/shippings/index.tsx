import admin from "@/queryKeys/admin";
import axiosInstance from "@/utils/axiosInstance.ts";
import { IShipping, TDeliveryStatusType, TError, TShippingSearchParams } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Flex,
  Form,
  type FormProps,
  Input,
  Row,
  Select,
  Spin,
  Table,
  type TableProps,
} from "antd";
import queryString from "query-string";
import type { FC } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

const Page: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm<TShippingSearchParams>();
  const { data: shippings } = useQuery(admin.shippings.pages(searchParams.toString()));

  const updateDeliveryStatusTypeMutation = useMutation<
    unknown,
    TError,
    { id: number; deliveryStatusType: TDeliveryStatusType }
  >({
    mutationFn: ({ id, deliveryStatusType }) =>
      axiosInstance.post(
        `/admin/shipping/update?shippingId=${id}&deliveryStatusType=${deliveryStatusType}`,
      ),
    onSuccess: async () => alert("바송상태가 업데이트 되었습니다"),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onFinish: FormProps<TShippingSearchParams>["onFinish"] = (shippingSearchParams) => {
    const page = searchParams.get("page");
    navigate(
      `${pathname}?${queryString.stringify({ ...shippingSearchParams, page }, { skipEmptyString: true })}`,
      {
        replace: true,
      },
    );
  };

  const onChangeUpdateDeliveryStatusType = (
    id: number,
    deliveryStatusType: TDeliveryStatusType,
  ) => {
    if (!window.confirm("해당 주문의 상태를 변경하시겠습니까?")) return;
    updateDeliveryStatusTypeMutation.mutate({ id, deliveryStatusType });
  };

  if (!shippings) return <Spin />;
  const columns: TableProps<IShipping>["columns"] = [
    {
      align: "center",
      dataIndex: "id",
      title: "id",
      render: (value) => value || "-",
    },
    {
      align: "center",
      dataIndex: "deliveryNum",
      title: "배송번호",
      render: (value) => value || "-",
    },
    {
      align: "center",
      dataIndex: "orderDate",
      title: "주문일",
      render: (value) => (value ? dayjs(value).format("YYYY-MM-DD") : "-"),
    },
    {
      align: "center",
      dataIndex: "deliveryAddress",
      title: "주소",
      render: (value) => value || "-",
    },
    {
      align: "center",
      title: "수량",
      render: (_, { products }) =>
        products
          .map(({ quantity }) => quantity)
          .reduce((previousValue, currentValue) => previousValue + currentValue),
    },
    {
      align: "center",
      dataIndex: "totalAmount",
      title: "금액",
      render: (value) =>
        new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
        }).format(value) || "-",
    },
    {
      align: "center",
      dataIndex: "deliveryType",
      title: "배송종류",
      render: (value) => value || "-",
    },
    {
      align: "center",
      dataIndex: "departureDate",
      title: "출발일",
      render: (value) => (value ? dayjs(value).format("YYYY-MM-DD") : "-"),
    },
    {
      align: "center",
      dataIndex: "arrivedDate",
      title: "도착일",
      render: (value) => (value ? dayjs(value).format("YYYY-MM-DD") : "-"),
    },
    {
      align: "center",
      dataIndex: "deliveryStatusType",
      title: "배송상태",
      ellipsis: true,
      render: (value, { id }) => (
        <Select
          defaultValue={value}
          onChange={(value) => onChangeUpdateDeliveryStatusType(id, value)}
        >
          <Select.Option value="ORDER_REQUESTED">ORDER_REQUESTED</Select.Option>
          <Select.Option value="ORDER_CANCELLATION_REQUESTED">
            ORDER_CANCELLATION_REQUESTED
          </Select.Option>
          <Select.Option value="ORDER_CANCELLED">ORDER_CANCELLED</Select.Option>
          <Select.Option value="ORDER_CANCELLATION_COMPLETED">
            ORDER_CANCELLATION_COMPLETED
          </Select.Option>
          <Select.Option value="READY_FOR_SHIPMENT">READY_FOR_SHIPMENT</Select.Option>
          <Select.Option value="DELIVERY_STARTED">DELIVERY_STARTED</Select.Option>
          <Select.Option value="IN_TRANSIT">IN_TRANSIT</Select.Option>
          <Select.Option value="DELIVERY_COMPLETED">DELIVERY_COMPLETED</Select.Option>
          <Select.Option value="DELIVERY_DELAYED">DELIVERY_DELAYED</Select.Option>
          <Select.Option value="REFUND_REQUESTED">REFUND_REQUESTED</Select.Option>
          <Select.Option value="REFUND_IN_PROGRESS">REFUND_IN_PROGRESS</Select.Option>
          <Select.Option value="REFUND_COMPLETED">REFUND_COMPLETED</Select.Option>
          <Select.Option value="RETURN_CONFIRMED">RETURN_CONFIRMED</Select.Option>
          <Select.Option value="CHANGE_REQUESTED">CHANGE_REQUESTED</Select.Option>
          <Select.Option value="CHANGE_REQUEST_CONFIRMED">CHANGE_REQUEST_CONFIRMED</Select.Option>
          <Select.Option value="CHANGE_COMPLETED">CHANGE_COMPLETED</Select.Option>
          <Select.Option value="PURCHASE_CONFIRMED">PURCHASE_CONFIRMED</Select.Option>
        </Select>
      ),
    },
    {
      align: "center",
      dataIndex: "deliveryCost",
      title: "배송비",
      render: (value) =>
        new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
        }).format(value) || "-",
    },
    {
      align: "center",
      dataIndex: "memberEmail",
      title: "주문자메일",
      render: (value) => value || "-",
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Form<TShippingSearchParams> form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item<TShippingSearchParams> name="deliveryNum">
              <Input placeholder="배송번호" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item<TShippingSearchParams> name="deliveryAddress">
              <Input placeholder="주소" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item<TShippingSearchParams> name="memberEmail">
              <Input placeholder="주문자메일" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Flex gap={8}>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  검색
                </Button>
              </Form.Item>
              <Form.Item>
                <Link to={pathname} onClick={() => form.resetFields()}>
                  <Button>초기화</Button>
                </Link>
              </Form.Item>
            </Flex>
          </Col>
        </Row>
      </Form>

      <Table<IShipping>
        scroll={{ y: 550 }}
        title={() => "배송관리"}
        rowKey={({ id }) => id}
        columns={columns}
        locale={{ emptyText: "검색결과가 없습니다" }}
        dataSource={shippings.content}
        pagination={{
          onChange: (page) => navigate(`${pathname}?page=${page}`, { replace: true }),
          pageSize: 5,
          current: shippings.page + 1,
          total: shippings.totalCount,
          showSizeChanger: false,
        }}
      />
    </Flex>
  );
};

export default Page;
