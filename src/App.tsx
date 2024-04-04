import { FC, useState } from "react";
import { Button, Layout, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import module from "./index.module.css";
import { SIGN_IN_ROUTES } from "@/utils/constants.ts";
import SignIn from "@/pages/signIn";
import useUserStore from "@/hooks/store/useUserStore.ts";

const App: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState<string>(
    SIGN_IN_ROUTES.find(({ path }) => path === pathname)?.key ?? "0",
  );
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { signIn } = useUserStore(({ signIn }) => ({
    signIn,
  }));

  if (signIn) {
    return (
      <Layout
        style={{
          height: "100vh",
        }}
      >
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
          <Layout.Header className={module.header}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className={module.fold_button}
            />
          </Layout.Header>
          <Layout.Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
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
      <Route path="/signIn" element={<SignIn />} />
      <Route path="*" element={<Navigate replace to="/signIn" />} />
    </Routes>
  );
};

export default App;
