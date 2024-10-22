import useAuth from "@/hooks/useAuth";
import { USER_SIGN_IN_ROUTES } from "@/utils/constants";
import {
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
import { Flex, Layout, Spin, Typography } from "antd";
import { FC, useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";

const User: FC = () => {
  const { data, isLoading } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    const abortController = new AbortController();
    window.addEventListener("resize", setVh, { signal: abortController.signal });
    return () => abortController.abort();
  }, []);

  if (isLoading) return <Spin fullscreen />;

  return (
    <Layout className="bg-white relative my-0 mx-auto max-w-[600px] h-[calc(var(--vh,1vh)*100)]">
      <Flex className="justify-between p-4">
        <Link to="/">
          <Typography className="text-2xl font-bold flex-shrink-0">KKK</Typography>
        </Link>
        <Flex className="gap-2">
          <Link to="/search">
            <SearchOutlined className="text-2xl" />
          </Link>
          <Link to="/carts">
            <ShoppingCartOutlined className="text-2xl" />
          </Link>
        </Flex>
      </Flex>
      <Flex className="p-2 flex-col flex-grow overflow-y-auto">
        <Routes>
          {data
            ? USER_SIGN_IN_ROUTES.filter(({ accessAbleAuth }) => accessAbleAuth).map(
                ({ Page, path }, index) => <Route key={index} path={path} element={<Page />} />,
              )
            : USER_SIGN_IN_ROUTES.map(({ Page, path, requiredAuth }, index) => (
                <Route
                  key={index}
                  path={path}
                  element={requiredAuth ? <Navigate to="/signin" replace /> : <Page />}
                />
              ))}

          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
      </Flex>
      <Flex className="border rounded-t-2xl justify-around p-4">
        <Link to="/" className="flex flex-col items-center">
          {pathname === "/" ? (
            <HomeFilled className="text-lg" />
          ) : (
            <HomeOutlined className="text-lg" />
          )}
          <Typography className="font-bold mt-2 text-xs">홈</Typography>
        </Link>
        <Link to="/products" className="flex flex-col items-center">
          {pathname === "/products" ? (
            <ProductFilled className="text-lg" />
          ) : (
            <ProductOutlined className="text-lg" />
          )}
          <Typography className="font-bold mt-2 text-xs">상품</Typography>
        </Link>
        <Link to="/categories" className="flex flex-col items-center">
          <UnorderedListOutlined className="text-xl" />
          <Typography className="font-bold mt-2 text-xs">카테고리</Typography>
        </Link>
        <Link to="/picks" className="flex flex-col items-center">
          {pathname === "/picks" ? (
            <HeartFilled className="text-lg" />
          ) : (
            <HeartOutlined className="text-lg" />
          )}
          <Typography className="font-bold mt-2 text-xs">찜</Typography>
        </Link>
        <Link to="/settings" className="flex flex-col items-center">
          {pathname === "/setting" ? (
            <SettingFilled className="text-lg" />
          ) : (
            <SettingOutlined className="text-lg" />
          )}
          <Typography className="font-bold mt-2 text-xs">마이페이지</Typography>
        </Link>
      </Flex>
    </Layout>
  );
};

export default User;
