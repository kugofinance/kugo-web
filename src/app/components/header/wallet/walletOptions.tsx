"use client";
import { Button } from "@radix-ui/themes";
import Image from "next/image";
import * as React from "react";
import { useConnect } from "wagmi";

const connector_icons: Record<string, string> = {
  MetaMask: "/icons/MetaMask_Fox.png",
  "Coinbase Wallet": "/icons/Coinbase_Wallet.webp",
};

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div className="flex items-center gap-5 self-end">
      Connect with
      {connectors.map((connector) => {
        return (
          <Button
            variant="surface"
            key={connector.uid}
            onClick={() => connect({ connector })}>
            {connector_icons[connector.name] && (
              <Image
                src={connector_icons[connector.name]}
                width={25}
                height={25}
                alt="Metamask Logo"
              />
            )}
            {connector.name}
          </Button>
        );
      })}
    </div>
  );
}
