"use client";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { usePathname } from "next/navigation";
import { FC, PropsWithChildren, useState } from "react";

import module from "./index.module.css";

import useUserStore from "@/app/_hooks/useStore";

const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();

  const { setSignIn } = useUserStore(({ signIn, setSignIn }) => ({
    setSignIn,
    signIn,
  }));
  const [selectedKey, setSelectedKey] = useState<string>("0");
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout className={module.layout}>
      <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          items={[]}
          onSelect={({ key }) => {
            console.log(pathname, setSelectedKey, key);
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
        <Layout.Content className={module.content}>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
