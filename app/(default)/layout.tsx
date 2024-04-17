"use client";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { FC, PropsWithChildren, useMemo, useState } from "react";

import module from "./index.module.css";

import useAuth from "@/app/_hooks/useAuth";
import { SIGN_IN_ROUTES } from "@/app/_utils/constants";

const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  const { signOut } = useAuth();
  const { push } = useRouter();
  const pathname = usePathname();
  const selectedKey = useMemo<string>(() => {
    const ROUTE = SIGN_IN_ROUTES.find((ROUTE) => ROUTE.path === pathname);
    if (ROUTE) return ROUTE.key;
    return "0";
  }, [pathname]);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout className={module.layout}>
      <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          items={SIGN_IN_ROUTES.map(({ key, Icon, label }) => ({
            icon: <Icon />,
            key,
            label,
          }))}
          onSelect={({ key }) => {
            const ROUTE = SIGN_IN_ROUTES.find((ROUTE) => ROUTE.key === key);
            if (ROUTE) push(ROUTE.path);
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
          <Button type="text" icon={<LogoutOutlined />} onClick={signOut} />
        </Layout.Header>
        <Layout.Content className={module.content}>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
