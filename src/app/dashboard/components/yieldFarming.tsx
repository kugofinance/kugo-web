import { Card, Heading, Separator, Callout } from "@radix-ui/themes";
import {
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { ADDRESSES } from "../constants/constants";
import { HealthFactor } from "./health/healthFactor";
import { DepositForm } from "./deposit/deposit";
import { BorrowForm } from "./borrow/borrow";
import { PositionManager } from "./positions/positionsManager";
import { add } from "lodash";

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
      <PositionManager address={address} />
      <Card className="h-full w-full">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4  rounded">
            <p className="text-sm text-gray-500">ETH Balance</p>
            <p className="text-xl font-bold">
              {ethBalance ? formatEther(ethBalance.value).slice(0, 8) : "0"} ETH
            </p>
          </div>
          <HealthFactor healthFactor={accountData?.[5]} />
        </div>

        <div className="space-y-6">
          <DepositForm address={address} balance={ethBalance?.value} />
          <BorrowForm address={address} maxBorrow={accountData?.[2]} />
        </div>

        <Callout.Root className="mt-6">
          <Callout.Icon className="h-4 w-4">
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text size={"1"}>
            Deposit ETH as collateral to enable borrowing • Borrow WBTC against
            your ETH collateral • Keep health factor above 1.0 to avoid
            liquidation • When WBTC price increases relative to ETH, repay loan
            for profit ⚠️ Always maintain a safe health factor
          </Callout.Text>
        </Callout.Root>
      </Card>
    </div>
  );
};
