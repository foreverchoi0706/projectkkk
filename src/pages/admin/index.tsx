import useQueryStore from "@/hooks/store/useQueryStore.ts";
import useAuth from "@/hooks/useAuth.ts";
import SignIn from "@/pages/admin/signIn";
import SignUp from "@/pages/admin/signUp";
import { SIGN_IN_ROUTES } from "@/utils/constants.ts";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, Layout, Menu } from "antd";
import { FC, KeyboardEventHandler, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const Admin: FC = () => {
  useQueryStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { auth, isLoading, logout } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const selectedKeys = SIGN_IN_ROUTES.find(({ path }) => path === pathname)?.key ?? "0";
  const onKeyDownSearch: KeyboardEventHandler<HTMLInputElement> = ({ currentTarget, key }) => {
    if (currentTarget.value !== "" && key === "Enter")
      navigate(`${pathname}?keyword=${currentTarget.value}`);
  };

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

  if (isLoading) return null;

  if (auth) {
    return (
      <Layout style={{ height: "100vh" }}>
        <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[selectedKeys]}
            selectedKeys={[selectedKeys]}
            items={SIGN_IN_ROUTES.filter(({ accessibleRoles }) =>
              accessibleRoles.has(auth.role),
            ).map(({ key, Icon, label }) => ({
              key,
              icon: <Icon />,
              label,
            }))}
            onSelect={({ key }) => {
              const route = SIGN_IN_ROUTES.at(Number(key));
              if (route) navigate(route.path);
            }}
          />
        </Layout.Sider>
        <Layout>
          <Layout.Header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#ffffff",
            }}
          >
            <Flex gap="middle">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
              {SIGN_IN_ROUTES.filter(({ searchable }) => searchable)
                .map(({ path }) => path)
                .includes(pathname) && (
                <Input
                  placeholder="통합검색"
                  suffix={<SearchOutlined />}
                  onKeyDown={onKeyDownSearch}
                />
              )}
            </Flex>
            <Button type="text" icon={<LogoutOutlined />} onClick={logout} />
          </Layout.Header>
          <Layout.Content
            style={{
              margin: "24px 16px",
              padding: "24px",
              minHeight: "280px",
            }}
          >
            <Routes>
              {SIGN_IN_ROUTES.map(({ Page, path }, index) => (
                <Route key={index} element={<Page />} path={path} />
              ))}
              <Route path="*" element={<Navigate replace to="/products" />} />
            </Routes>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/*" element={<Navigate replace to="/admin/signin" />} />
    </Routes>
  );
};

export default Admin;
