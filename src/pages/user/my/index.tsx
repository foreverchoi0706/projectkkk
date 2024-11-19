import useAuth from "@/hooks/useAuth";
import user from "@/queryKeys/user";
import axiosInstance from "@/utils/axiosInstance.ts";
import { RightOutlined } from "@ant-design/icons";
import { useMutation, useQueries } from "@tanstack/react-query";
import { Divider, Flex, Typography } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

const Page: FC = () => {
  const { info, logout } = useAuth();

  const mutation = useMutation({
    mutationFn: () => axiosInstance.post("/member/cancel"),
    onSuccess: () => {
      alert("탈퇴되었습니다");
      logout();
    },
  });

  const onClickWithdrawButton = () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;
    mutation.mutate();
  };

  const queries = useQueries({
    queries: [user.order.all(), user.reviews.all(), user.coupons.all(), user.qnas.all()],
  });

  if (queries.every(({ isLoading }) => isLoading)) return null;

  const [{ data: order }, { data: reviews }, { data: coupons }, { data: qnas }] = queries;

  return (
    <main>
      <Flex className="flex-col justify-center items-center gap-2 p-8">
        <Typography className="font-bold text-2xl">{info?.name}님</Typography>
        <Typography className="text-lg">{info?.point}P</Typography>
        <Typography className="text-lg">{info?.email}</Typography>
      </Flex>
      <Divider className="border-t-8" />
      <Flex className="flex-col gap-8">
        <Link to="/my/orders">
          <Flex className="items-center justify-between">
            <Typography className="font-bold text-lg">주문 배송</Typography>
            <Typography className="font-bold text-lg">
              <Typography className="text-lg inline text-pink-500">
                {order?.totalCount || 0}{" "}
              </Typography>
              <RightOutlined />
            </Typography>
          </Flex>
        </Link>
        <Link to="/my/reviews">
          <Flex className="items-center justify-between">
            <Typography className="font-bold text-lg">리뷰</Typography>
            <Typography className="font-bold text-lg">
              <Typography className="text-lg inline text-pink-500">
                {reviews?.totalCount || 0}{" "}
              </Typography>
              <RightOutlined />
            </Typography>
          </Flex>
        </Link>
        <Link to="/my/coupons">
          <Flex className="items-center justify-between">
            <Typography className="font-bold text-lg">쿠폰</Typography>
            <Typography className="font-bold text-lg">
              <Typography className="text-lg inline text-pink-500">
                {coupons?.totalCount || 0}{" "}
              </Typography>
              <RightOutlined />
            </Typography>
          </Flex>
        </Link>
        <Link to="/my/qnas">
          <Flex className="items-center justify-between">
            <Typography className="font-bold text-lg">QnA</Typography>
            <Typography className="font-bold text-lg">
              <Typography className="text-lg inline text-pink-500">
                {qnas?.totalCount || 0}{" "}
              </Typography>
              <RightOutlined />
            </Typography>
          </Flex>
        </Link>
        <Link to="/my/accounts">
          <Flex className="items-center justify-between">
            <Typography className="font-bold text-lg">회원정보 수정</Typography>
            <Typography className="font-bold text-lg">
              <RightOutlined />
            </Typography>
          </Flex>
        </Link>
        <Link to="/signin" onClick={logout}>
          <Flex className="items-center justify-between">
            <Typography className="font-bold text-lg">로그아웃</Typography>
            <Typography className="font-bold text-lg">
              <RightOutlined />
            </Typography>
          </Flex>
        </Link>
        <Flex
          onClick={onClickWithdrawButton}
          className="cursor-pointer items-center justify-between"
        >
          <Typography className="font-bold text-lg">회원탈퇴</Typography>
          <Typography className="font-bold text-lg">
            <RightOutlined />
          </Typography>
        </Flex>
      </Flex>
      <Divider className="border-t-8" />
    </main>
  );
};

export default Page;
