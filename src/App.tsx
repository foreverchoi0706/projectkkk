import useAuth from "@/hooks/useAuth.ts";
import SignIn from "@/pages/signIn";
import SignUp from "@/pages/signUp";
import { SIGN_IN_ROUTES } from "@/utils/constants.ts";
import queryKeys from "@/utils/queryKeys.ts";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Flex, Input, Layout, Menu } from "antd";
import { FC, KeyboardEventHandler, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const App: FC = () => {
  let timeOut: number | null = null;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { role, signIn, token, login, logout } = useAuth();

  const [selectedKey, setSelectedKey] = useState<string>(
    SIGN_IN_ROUTES.find(({ path }) => path === pathname)?.key ?? "0",
  );
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const { data: verify, isLoading } = useQuery({
    ...queryKeys.auth.verify(token),
    enabled: token.accessToken !== "" && token.refreshToken !== "",
  });

  const onKeyDownSearch: KeyboardEventHandler<HTMLInputElement> = ({ currentTarget, key }) => {
    if (currentTarget.value !== "" && key === "Enter")
      navigate(`${pathname}?keyword=${currentTarget.value}`);
  };

  useEffect(() => {
    if (!verify) return;
    login(verify);
  }, [verify]);

  useEffect(() => {
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

  if (signIn && role !== null) {
    return (
      <Layout style={{ height: "100vh" }}>
        <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[selectedKey]}
            selectedKeys={[selectedKey]}
            items={SIGN_IN_ROUTES.filter(({ accessibleRoles }) => accessibleRoles.has(role)).map(
              ({ key, Icon, label }) => ({
                key,
                icon: <Icon />,
                label,
              }),
            )}
            onSelect={({ key }) => {
              const route = SIGN_IN_ROUTES.at(+key);
              if (route) {
                setSelectedKey(route.key);
                navigate(route.path);
              }
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
              <Route path="*" element={<Navigate replace to={SIGN_IN_ROUTES[0].path} />} />
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
      <Route path="*" element={<Navigate replace to="/signin" />} />
    </Routes>
  );
};

export default App;
