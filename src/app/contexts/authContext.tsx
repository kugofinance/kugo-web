// src/app/contexts/authContexts.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { formatUnits } from "viem";

interface AuthContextType {
  address: string | undefined;
  isConnected: boolean;
  hasAccess: boolean;
  isLoading: boolean;
  tokenBalance: string | null;
  error: string | null;
  isInitialized: boolean; // New flag to track initial data fetch
}

interface AuthProviderProps {
  children: React.ReactNode;
  requiredTokenAmount: string;
  tokenAddress: `0x${string}`;
}

const ERC20_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  requiredTokenAmount,
  tokenAddress,
}: AuthProviderProps) => {
  const { address, isConnected } = useAccount();
  const [hasAccess, setHasAccess] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get token balance
  const { data: balance, isLoading: isBalanceLoading } = useContractRead({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    // enabled: !!address,
  });

  // Get decimals
  const { data: decimals, isLoading: isDecimalsLoading } = useContractRead({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
    // enabled: !!address,
  });

  useEffect(() => {
    // Reset states when wallet disconnects
    if (!isConnected) {
      setTokenBalance(null);
      setHasAccess(false);
      setError(null);
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }

    // Wait for both balance and decimals to load
    if (isBalanceLoading || isDecimalsLoading) {
      setIsLoading(true);
      return;
    }

    // Handle case where wallet is connected but balance fetch failed
    if (!balance || !decimals) {
      setTokenBalance("0");
      setHasAccess(false);
      setError("No tokens found in wallet");
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }

    try {
      const formattedBalance = formatUnits(balance, decimals);
      setTokenBalance(formattedBalance);

      const hasRequiredAmount =
        parseFloat(formattedBalance) >= parseFloat(requiredTokenAmount);
      setHasAccess(hasRequiredAmount);

      setError(
        hasRequiredAmount
          ? null
          : `Minimum ${requiredTokenAmount} tokens required`
      );
      setIsInitialized(true);
    } catch (err) {
      setError("Error processing token balance");
      setHasAccess(false);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    balance,
    decimals,
    isBalanceLoading,
    isDecimalsLoading,
    requiredTokenAmount,
    isConnected,
  ]);

  const contextValue: AuthContextType = {
    address,
    isConnected,
    hasAccess,
    isLoading,
    tokenBalance,
    error,
    isInitialized,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export type { AuthContextType };
