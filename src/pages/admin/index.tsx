import useQueryStore from "@/hooks/store/useQueryStore";
import useAuth from "@/hooks/useAuth";
import SignIn from "@/pages/admin/signIn";
import SignUp from "@/pages/admin/signUp";
import { ADMIN_SIGN_IN_ROUTES } from "@/utils/constants";
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Flex, Layout, Menu, Spin } from "antd";
import { FC, useEffect, useState } from "react";
import { Link, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const Admin: FC = () => {
  useQueryStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data, isLoading, logout } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const selectedKeys =
    ADMIN_SIGN_IN_ROUTES.find(({ path }) => `/admin${path}` === pathname)?.key ?? "0";

  useEffect(() => {
    let timeOut: number | null = null;
    const abortController = new AbortController();
    window.addEventListener(
      "resize",
      () => {
        if (timeOut) clearTimeout(timeOut);
        timeOut = window.setTimeout(() => setCollapsed(window.innerWidth < 1000), 200);
      },
      { signal: abortController.signal },
    );
    return () => abortController.abort();
  }, []);

  if (isLoading) return <Spin fullscreen />;

  if (data) {
    return (
      <Layout className="h-screen">
        <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[selectedKeys]}
            selectedKeys={[selectedKeys]}
            items={ADMIN_SIGN_IN_ROUTES.filter(({ accessibleRoles }) =>
              accessibleRoles.has(data.role),
            ).map(({ key, Icon, label }) => ({
              key,
              icon: <Icon />,
              label,
            }))}
            onSelect={({ key }) => {
              const route = ADMIN_SIGN_IN_ROUTES.at(Number(key));
              if (route) navigate(`/admin${route.path}`);
            }}
          />
        </Layout.Sider>
        <Layout>
          <Layout.Header className="flex justify-between items-center bg-white">
            <Flex gap="middle">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
            </Flex>
            <Link to="/admin/signin" onClick={logout}>
              <Button type="text" icon={<LogoutOutlined />} />
            </Link>
          </Layout.Header>
          <Layout.Content className="m-6 p-6">
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/*" element={<Navigate replace to="/signin" />} />
    </Routes>
  );
};

export default Admin;
