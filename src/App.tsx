import useStore from "@/hooks/useStore";
import SignIn from "@/pages/signIn";
import SignUp from "@/pages/signUp";
import { ADMIN_ACCESS_TOKEN, SIGN_IN_ROUTES } from "@/utils/constants.ts";
import { deleteCookie } from "@/utils/cookie.ts";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, Layout, Menu } from "antd";
import { FC, KeyboardEventHandler, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const App: FC = () => {
  let timeOut: number | null = null;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signIn, setSignIn } = useStore(({ signIn, setSignIn }) => ({
    signIn,
    setSignIn,
  }));
  const [selectedKey, setSelectedKey] = useState<string>(
    SIGN_IN_ROUTES.find(({ path }) => path === pathname)?.key ?? "0",
  );
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const onClickSignOut = () => {
    deleteCookie(ADMIN_ACCESS_TOKEN);
    setSignIn(false);
    window.location.href = "/signIn";
  };

  const onKeyDownSearch: KeyboardEventHandler<HTMLInputElement> = ({ currentTarget, key }) => {
    if (currentTarget.value !== "" && key === "Enter")
      navigate(`${pathname}?keyword=${currentTarget.value}`);
  };

  useEffect(() => {
    const abortController = new AbortController();
    window.addEventListener(
      "resize",
      () => {
        if (timeOut) clearTimeout(timeOut);
        timeOut = window.setTimeout(() => setCollapsed(window.innerWidth < 1000), 200);
      },
      {
        signal: abortController.signal,
      },
    );
    return () => abortController.abort();
  }, []);

  if (signIn) {
    return (
      <Layout style={{ height: "100vh" }}>
        <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[selectedKey]}
            selectedKeys={[selectedKey]}
            items={SIGN_IN_ROUTES.map(({ key, Icon, label }) => ({
              key,
              icon: <Icon />,
              label,
            }))}
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
            <Button type="text" icon={<LogoutOutlined />} onClick={onClickSignOut} />
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
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="*" element={<Navigate replace to="/signIn" />} />
    </Routes>
  );
};

export default App;
