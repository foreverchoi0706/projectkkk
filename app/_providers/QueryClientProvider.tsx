"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, PropsWithChildren } from "react";

const ReactQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        networkMode: "always",
        refetchOnMount: false,
        retry: false,
        staleTime: Infinity,
      },
    },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
