import App from "@/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "@/global.css";
import { scan } from "react-scan";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Number.POSITIVE_INFINITY,
      staleTime: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
    },
  },
});
if (import.meta.env.MODE === "development") {
  scan({
    showToolbar: false,
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools client={queryClient} />
      </QueryClientProvider>
    </ConfigProvider>
  </StrictMode>,
);
