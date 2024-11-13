import { Card, Callout, Flex, Text } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { ADDRESSES } from "../constants/constants";
import { DepositForm } from "./deposit/deposit";
import { BorrowForm } from "./borrow/borrow";
import { PositionManager } from "./positions/positionsManager";

export const YieldFarming = () => {
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({
    address,
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
    query: {
      enabled: Boolean(address),
    },
  });

  return (
    <div className="flex items-start h-[430px] w-full gap-2">
      <div className="h-full flex flex-col gap-1">
        <Card className="h-3/4">
          <div className="p-4 rounded">
            <Text className="text-sm text-gray-500">ETH Balance</Text>
            <br />
            <Text className="text-xl font-bold">
              {ethBalance ? formatEther(ethBalance.value).slice(0, 8) : "0"} ETH
            </Text>
          </div>

          <div className="space-y-8">
            <DepositForm address={address} balance={ethBalance?.value} />
            <BorrowForm address={address} maxBorrow={accountData?.[2]} />
          </div>
        </Card>

        <Card className="h-1/4">
          <Callout.Root color="amber">
            <Callout.Icon className="h-4 w-4">
              <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text size={"1"}>
              Always maintain a safe health factor of 1.0 or greater
            </Callout.Text>
          </Callout.Root>
        </Card>
      </div>
      <PositionManager address={address} />
    </div>
  );
};
