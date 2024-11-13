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
          requiredTokenAmount="15000000"
          tokenAddresses={[
            "0x44857b8f3a6fcfa1548570cf637fc8330683bf3d",
            "0xc5903ced3c193b89cbbb5a0af584494c3d5d289d",
          ]}>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
