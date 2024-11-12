// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "./utils/wagmiConfig";
import { AuthProvider } from "./contexts/authContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider
          requiredTokenAmount="1"
          tokenAddress="0xdAC17F958D2ee523a2206206994597C13D831ec7">
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
