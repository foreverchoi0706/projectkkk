import { AntdRegistry } from "@ant-design/nextjs-registry";
import { type Viewport } from "next";
import type { FC, PropsWithChildren } from "react";

import ReactQueryProvider from "@/app/_providers/QueryClientProvider";

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
        <AntdRegistry>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AntdRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
