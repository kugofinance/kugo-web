import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";

interface TokenBalance {
  address: string;
  balance: string;
  hasRequiredAmount: boolean;
}

interface AuthContextType {
  address: string | undefined;
  isConnected: boolean;
  hasAccess: boolean;
  isLoading: boolean;
  tokenBalances: TokenBalance[];
  error: string | null;
  isInitialized: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
  requiredTokenAmount: string;
  tokenAddresses: `0x${string}`[];
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
  tokenAddresses,
}: AuthProviderProps) => {
  const { address, isConnected } = useAccount();
  const [hasAccess, setHasAccess] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Prepare contract reads for all tokens
  const contractReads = tokenAddresses.flatMap((tokenAddress) => [
    {
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: address ? [address] : undefined,
    },
    {
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "decimals",
    },
  ]);

  // Read all token balances and decimals in one go
  const { data: results, isLoading: isContractsLoading } = useReadContracts({
    contracts: contractReads,
    enabled: isConnected && !!address,
  });

  useEffect(() => {
    // Reset states when wallet disconnects
    if (!isConnected) {
      setTokenBalances([]);
      setHasAccess(false);
      setError(null);
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }

    // Wait for contract reads to complete
    if (isContractsLoading) {
      setIsLoading(true);
      return;
    }

    try {
      const processedBalances: TokenBalance[] = tokenAddresses.map(
        (tokenAddress, index) => {
          // Get balance and decimals from results
          const balanceResult = results[index * 2];
          const decimalsResult = results[index * 2 + 1];

          // Check if we have valid results
          if (
            balanceResult === undefined ||
            decimalsResult === undefined ||
            balanceResult.status === "failure" ||
            decimalsResult.status === "failure"
          ) {
            return {
              address: tokenAddress,
              balance: "0",
              hasRequiredAmount: false,
            };
          }

          // Safe to access .result as we've checked for failure status
          const balance = balanceResult.result;
          const decimals = decimalsResult.result;

          const formattedBalance = formatUnits(balance, decimals);
          const hasRequiredAmount =
            parseFloat(formattedBalance) >= parseFloat(requiredTokenAmount);

          return {
            address: tokenAddress,
            balance: formattedBalance,
            hasRequiredAmount,
          };
        }
      );

      const hasAnyRequiredAmount = processedBalances.some(
        (token) => token.hasRequiredAmount
      );

      setTokenBalances(processedBalances);
      setHasAccess(hasAnyRequiredAmount);
      setError(
        hasAnyRequiredAmount
          ? null
          : `Minimum ${requiredTokenAmount} tokens required in KUGO or KIRO`
      );
      setIsInitialized(true);
    } catch (err) {
      console.error("Token balance processing error:", err);
      setError("Error processing token balances");
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  }, [
    results,
    isContractsLoading,
    requiredTokenAmount,
    isConnected,
    tokenAddresses,
  ]);

  const contextValue: AuthContextType = {
    address,
    isConnected,
    hasAccess,
    isLoading,
    tokenBalances,
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

export type { AuthContextType, TokenBalance };
