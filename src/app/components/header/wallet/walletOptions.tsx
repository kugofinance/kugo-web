"use client";
import { Link1Icon } from "@radix-ui/react-icons";
import { Button, DropdownMenu, ScrollArea } from "@radix-ui/themes";
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
    <div className="flex items-center gap-2 self-end">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="">
          <Button variant="surface">
            <Link1Icon />
            Connect Wallet
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content sideOffset={5}>
          {connectors.map((connector) => (
            <DropdownMenu.Item
              key={connector.uid}
              onClick={() => connect({ connector })}>
              {connector_icons[connector.name] && (
                <Image
                  src={connector_icons[connector.name]}
                  width={20}
                  height={20}
                  alt={`${connector.name} Logo`}
                />
              )}
              {connector.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
