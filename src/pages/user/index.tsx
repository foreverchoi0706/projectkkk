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
import { FC } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

const User: FC = () => {
  const { data } = useAuth();

  return (
    <Layout className="relative my-0 mx-auto max-w-[600px] p-4 h-[100vh]">
      <Flex justify="space-between" gap="middle" align="center">
        <Typography className="flex-shrink-0">KKK</Typography>
        <Link to="/search">
          <SearchOutlined />
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
          <HomeOutlined />
        </Link>
        <Link to="/">
          <UnorderedListOutlined />
        </Link>
        <Link to="/">
          <HeartOutlined />
        </Link>
        <Link to="/setting">
          <SettingOutlined />
        </Link>
      </Flex>
    </Layout>
  );
};

export default User;
