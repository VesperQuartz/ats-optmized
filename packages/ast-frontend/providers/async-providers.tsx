"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

export const AsyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClent] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClent}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
