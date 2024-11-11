import {
  BellOutlined,
  HeartFilled,
  HeartOutlined,
  HomeFilled,
  HomeOutlined,
  ProductFilled,
  ProductOutlined,
  SearchOutlined,
  SettingFilled,
  SettingOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Flex, Layout, Typography } from "antd";
import { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link, Outlet, ScrollRestoration, useLocation } from "react-router-dom";

const User: FC = () => {
  const { pathname } = useLocation();

  return (
    <Layout className="bg-white relative my-0 mx-auto max-w-[600px] pb-[78px]">
      <Flex className="justify-between p-4">
        <Link to="/">
          <Typography className="text-2xl font-bold flex-shrink-0">KKK</Typography>
        </Link>
        <Flex className="gap-4">
          <Link to="/search">
            <BellOutlined className="text-2xl" />
          </Link>
          <Link to="/search">
            <SearchOutlined className="text-2xl" />
          </Link>
          <Link to="/carts">
            <ShoppingCartOutlined className="text-2xl" />
          </Link>
        </Flex>
      </Flex>
      <Flex className="p-2 flex-col flex-grow overflow-y-auto">
        <ErrorBoundary
          fallback={
            <Flex className="h-[calc(100vh-142px)] justify-center items-center flex-col gap-4">
              <Typography className="text-5xl">😥</Typography>
              <Typography className="text-2xl">오류가 발생하였습니다</Typography>
              <Button type="primary" onClick={window.location.reload}>
                새로고침하기
              </Button>
            </Flex>
          }
        >
          <Outlet />
        </ErrorBoundary>
      </Flex>
      {!pathname.includes("/products") && (
        <Flex className="border rounded-t-2xl justify-around p-4 fixed bottom-0 max-w-[584px] w-full z-10 bg-white">
          <Link to="/" className="flex-1 flex flex-col items-center">
            {pathname === "/" ? (
              <HomeFilled className="text-lg" />
            ) : (
              <HomeOutlined className="text-lg" />
            )}
            <Typography className="font-bold mt-2 text-xs">홈</Typography>
          </Link>
          <Link to="/search" className="flex-1 flex flex-col items-center">
            {pathname === "/search" ? (
              <ProductFilled className="text-lg" />
            ) : (
              <ProductOutlined className="text-lg" />
            )}
            <Typography className="font-bold mt-2 text-xs">상품</Typography>
          </Link>
          <Link to="/categories" className="flex-1 flex flex-col items-center">
            <UnorderedListOutlined className="text-xl" />
            <Typography className="font-bold mt-2 text-xs">카테고리</Typography>
          </Link>
          <Link to="/picks" className="flex-1 flex flex-col items-center">
            {pathname === "/picks" ? (
              <HeartFilled className="text-lg" />
            ) : (
              <HeartOutlined className="text-lg" />
            )}
            <Typography className="font-bold mt-2 text-xs">찜</Typography>
          </Link>
          <Link to="/settings" className="flex-1 flex flex-col items-center">
            {pathname === "/setting" ? (
              <SettingFilled className="text-lg" />
            ) : (
              <SettingOutlined className="text-lg" />
            )}
            <Typography className="font-bold mt-2 text-xs">마이페이지</Typography>
          </Link>
        </Flex>
      )}
      <ScrollRestoration />
    </Layout>
  );
};

export default User;
