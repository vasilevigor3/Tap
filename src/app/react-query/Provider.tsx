"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

type ReactQueryProviderProps = Readonly<{
  children: React.ReactNode;
}>;

const ReactQueryProvider = (props: ReactQueryProviderProps) => {
  const { children } = props;

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
