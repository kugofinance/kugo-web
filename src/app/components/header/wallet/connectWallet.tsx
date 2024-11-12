"use client";
import { useAccount } from "wagmi";
import { Account } from "./account";
import { WalletOptions } from "./walletOptions";

export function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}
