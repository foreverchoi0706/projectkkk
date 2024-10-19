import useAuth from "@/hooks/useAuth.ts";
import { USER_SIGN_IN_ROUTES } from "@/utils/constants.ts";
import {
  HeartFilled,
  HeartOutlined,
  HomeFilled,
  HomeOutlined,
  SearchOutlined,
  SettingFilled,
  SettingOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Flex, Layout, Typography } from "antd";
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

  if (isLoading) return null;

  return (
    <Layout className="relative my-0 mx-auto max-w-[600px] p-4 h-[calc(var(--vh,1vh)*100)]">
      <Flex className="justify-between pb-4">
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
      <Flex className="flex-col flex-grow overflow-y-auto">
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
      <Flex className="justify-around pt-4">
        <Link to="/">
          {pathname === "/" ? (
            <HomeFilled className="text-xl" />
          ) : (
            <HomeOutlined className="text-xl" />
          )}
        </Link>
        <Link to="/">
          <UnorderedListOutlined className="text-xl" />
        </Link>
        <Link to="/picks">
          {pathname === "/picks" ? (
            <HeartFilled className="text-xl" />
          ) : (
            <HeartOutlined className="text-xl" />
          )}
        </Link>
        <Link to="/setting">
          {pathname === "/setting" ? (
            <SettingFilled className="text-xl" />
          ) : (
            <SettingOutlined className="text-xl" />
          )}
        </Link>
      </Flex>
    </Layout>
  );
};

export default User;
