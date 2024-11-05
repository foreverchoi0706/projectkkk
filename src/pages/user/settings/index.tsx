import useAuth from "@/hooks/useAuth";
import user from "@/queryKeys/user";
import { RightOutlined } from "@ant-design/icons";
import { useQueries } from "@tanstack/react-query";
import { Divider, Flex, Spin, Typography } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

const Page: FC = () => {
  const { info, logout } = useAuth();

  const queries = useQueries({ queries: [user.coupons.all()] });

  if (queries.every(({ isLoading }) => isLoading)) return <Spin fullscreen />;

  const [{ data: coupons }] = queries;

  return (
    <main>
      <Flex className="flex-col justify-center items-center gap-2 p-8">
        <Typography className="font-bold text-2xl">{info?.name}님</Typography>
        <Typography className="text-lg">{info?.point}P</Typography>
        <Typography className="text-lg">{info?.email}</Typography>
      </Flex>
      <Divider className="border-t-8" />
      <Flex className="flex-col gap-8">
        <Link to="/settings/shipping">
          <Flex className="items-center justify-between">
            <Typography className="font-bold text-lg">주문 배송</Typography>
            <Typography className="font-bold text-lg">
              <RightOutlined />
            </Typography>
          </Flex>
        </Link>
        <Link to="/settings/reviews">
          <Flex className="items-center justify-between">
            <Typography className="font-bold text-lg">리뷰</Typography>
            <Typography className="font-bold text-lg">
              <RightOutlined />
            </Typography>
          </Flex>
        </Link>
        <Link to="/settings/coupons">
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
        <Link to="/settings/qnas">
          <Flex className="items-center justify-between">
            <Typography className="font-bold text-lg">QnA</Typography>
            <Typography className="font-bold text-lg">
              <RightOutlined />
            </Typography>
          </Flex>
        </Link>
        <Link to="/">
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
        <Link to="/">
          <Flex className="items-center justify-between">
            <Typography className="font-bold text-lg">회원탈퇴</Typography>
            <Typography className="font-bold text-lg">
              <RightOutlined />
            </Typography>
          </Flex>
        </Link>
      </Flex>
      <Divider className="border-t-8" />
    </main>
  );
};

export default Page;
