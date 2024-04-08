import { AntdRegistry } from "@ant-design/nextjs-registry";
import { type Viewport } from "next";
import type { FC, PropsWithChildren } from "react";
export const viewport: Viewport = {
  themeColor: {
    color: "#ffffff",
    media: "(prefers-color-scheme: dark)",
  },
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
