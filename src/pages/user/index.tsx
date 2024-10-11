import useAuth from "@/hooks/useAuth.ts";
import Settings from "@/pages/user/settings";
import Home from "@/pages/user/home";
import Search from "@/pages/user/search";
import SignIn from "@/pages/user/signIn";
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
  const { data } = useAuth();
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
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/setting"
            element={!data ? <Settings /> : <Navigate to="/signin" replace />}
          />
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
