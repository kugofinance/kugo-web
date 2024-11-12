"use client";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { SliceAddress } from "@/app/utils/sliceAddress";
import { GetEnsAvatarReturnType, GetEnsNameReturnType } from "viem";
import { useAuth } from "@/app/contexts/authContext";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const { hasAccess, tokenBalance } = useAuth();

  return (
    <div className="flex flex-row gap-4 items-center self-end">
      <AccountMenu
        address={address}
        ensName={ensName}
        ensAvatar={ensAvatar}
        tokenBalance={tokenBalance}
        hasAccess={hasAccess}
      />
      <Button variant="surface" onClick={() => disconnect()}>
        <ExitIcon />
        Disconnect
      </Button>
    </div>
  );
}

function AccountMenu({
  address,
  ensName,
  ensAvatar,
  tokenBalance,
  hasAccess,
}: {
  address: `0x${string}` | undefined;
  ensName: GetEnsNameReturnType | undefined;
  ensAvatar: GetEnsAvatarReturnType | undefined;
  tokenBalance: string | null;
  hasAccess: boolean;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {address && (
          <Button variant="ghost">
            {ensAvatar ? (
              <Image alt="ENS Avatar" src={ensAvatar} />
            ) : (
              <PersonIcon />
            )}
            {ensName ? `${ensName} (${address})` : SliceAddress(address)}
          </Button>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={10}>
        <DropdownMenu.Label>
          Token Balance: {tokenBalance || "0"}
        </DropdownMenu.Label>
        <DropdownMenu.Label>
          Status: {hasAccess ? "✅ Full Access" : "⚠️ Limited Access"}
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ E">Edit Display Name</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ D">View Friends</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
