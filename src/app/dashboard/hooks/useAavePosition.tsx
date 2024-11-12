import { useReadContract, useReadContracts } from "wagmi";
import { ADDRESSES, ABIS } from "../constants/constants";
import { formatEther, isAddress } from "viem";

export const useAavePosition = (address?: string) => {
  const isValidAddress = address ? isAddress(address) : false;

  const { data: accountData } = useReadContract({
    address: ADDRESSES.SEPOLIA.POOL,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
        ],
        name: "getUserAccountData",
        outputs: [
          {
            internalType: "uint256",
            name: "totalCollateralBase",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalDebtBase",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "availableBorrowsBase",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentLiquidationThreshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ltv",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "healthFactor",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getUserAccountData",
    args: isValidAddress ? [address] : undefined,
    enabled: isValidAddress,
  });
  console.log(accountData);
  // Just return raw data, no formatting
  return accountData;
};

export const useAaveUserData = (address?: string) => {
  // Get aWETH balance
  const { data: aWethBalance } = useReadContract({
    address: ADDRESSES.SEPOLIA.AWETH, // You'll need to add this to your addresses
    abi: [
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  // Get user's Aave account data
  const { data: accountData } = useReadContract({
    address: ADDRESSES.SEPOLIA.POOL,
    abi: [
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "getUserAccountData",
        outputs: [
          {
            internalType: "uint256",
            name: "totalCollateralBase",
            type: "uint256",
          },
          { internalType: "uint256", name: "totalDebtBase", type: "uint256" },
          {
            internalType: "uint256",
            name: "availableBorrowsBase",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentLiquidationThreshold",
            type: "uint256",
          },
          { internalType: "uint256", name: "ltv", type: "uint256" },
          { internalType: "uint256", name: "healthFactor", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getUserAccountData",
    args: [address as `0x${string}`],
  });

  return {
    aWethBalance,
    accountData,
  };
};
