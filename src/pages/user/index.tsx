import useAuth from "@/hooks/useAuth.ts";
import Setting from "@/pages/admin/setting";
import Page from "@/pages/user/home";
import Search from "@/pages/user/search";
import SignIn from "@/pages/user/signIn";
import {
  HeartOutlined,
  HomeOutlined,
  SearchOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Flex, Layout, Typography } from "antd";
import { FC, useEffect } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

const User: FC = () => {
  const { data } = useAuth();
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
    };
  }, []);
  return (
    <Layout className="relative my-0 mx-auto max-w-[600px] p-4 h-screen h-[calc(var(--vh,1vh)*100)]">
      <Flex justify="space-between" gap="middle" align="center">
        <Typography className="flex-shrink-0">KKK</Typography>
        <Link to="/search">
          <SearchOutlined className="text-xl" />
        </Link>
      </Flex>
      <Flex className="flex-col flex-grow overflow-y-auto">
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/setting" element={data ? <Setting /> : <Navigate to="/signin" replace />} />
          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
      </Flex>
      <Flex className="justify-around  bottom-0 w-full">
        <Link to="/">
          <HomeOutlined className="text-xl" />
        </Link>
        <Link to="/">
          <UnorderedListOutlined className="text-xl" />
        </Link>
        <Link to="/">
          <HeartOutlined className="text-xl" />
        </Link>
        <Link to="/setting">
          <SettingOutlined className="text-xl" />
        </Link>
      </Flex>
    </Layout>
  );
};

export default User;
