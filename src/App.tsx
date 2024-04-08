import { FC, useState } from "react";
import { Button, Layout, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
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
import useStore from "@/hooks/useStore";

const App: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signIn, setSignIn } = useStore(({ signIn, setSignIn }) => ({
    signIn,
    setSignIn,
  }));
  const [selectedKey, setSelectedKey] = useState<string>(
    SIGN_IN_ROUTES.find(({ path }) => path === pathname)?.key ?? "0"
  );
  const [collapsed, setCollapsed] = useState<boolean>(false);

  if (signIn) {
    return (
      <Layout className={module.layout}>
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
            />
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={() => setSignIn(false)}
            />
          </Layout.Header>
          <Layout.Content className={module.content}>
            <Routes>
              {SIGN_IN_ROUTES.map(({ Page, path }, index) => (
                <Route key={index} element={<Page />} path={path} />
              ))}
              <Route
                path="*"
                element={<Navigate replace to={SIGN_IN_ROUTES[0].path} />}
              />
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
