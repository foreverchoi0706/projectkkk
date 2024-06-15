import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import { ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Infinity,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={{ token: {} }}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
);
