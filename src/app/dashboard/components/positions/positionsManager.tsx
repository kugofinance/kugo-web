import { Card, Heading } from "@radix-ui/themes";
import { formatEther, formatUnits } from "viem";
import { useAavePosition } from "../../hooks/useAavePosition";
import { HealthFactor } from "../health/healthFactor";
import { PositionStats } from "./positionStats";
import { SuppliedPosition } from "./suppliedPositions";
import { BorrowedPosition } from "./borrowedPositions";
import { usePriceFeeds } from "@/app/hooks/usePriceFeeds";
import { formatAaveAmount, formatAaveMetrics } from "../../utils/format";

interface PositionManagerProps {
  address?: string;
}

export const PositionManager = ({ address }: PositionManagerProps) => {
  const accountData = useAavePosition(address);
  const { eth, btc } = usePriceFeeds();

  const totalCollateral = accountData?.[0] || BigInt(0);
  const totalDebt = accountData?.[1] || BigInt(0);
  const availableBorrows = accountData?.[2] || BigInt(0);
  const liquidationThreshold = accountData?.[3] || BigInt(0);
  const ltv = accountData?.[4] || BigInt(0);
  const healthFactor = accountData?.[5];

  // Format using the new utilities
  const formattedCollateral =
    formatAaveMetrics.formatBaseUnits(totalCollateral);
  const formattedDebt = formatAaveMetrics.formatBaseUnits(totalDebt);
  const formattedAvailable =
    formatAaveMetrics.formatBaseUnits(availableBorrows);
  const formattedHealthFactor =
    formatAaveMetrics.formatHealthFactor(healthFactor);
  const formattedLTV = formatAaveMetrics.formatBasisPoints(ltv);

  const suppliedAsset = {
    symbol: "ETH",
    logo: "/icons/ethereum-eth-logo.png",
    rawAmount: totalCollateral,
    decimals: 8,
    amount: formattedCollateral,
  };

  const borrowedAsset = {
    symbol: "WBTC",
    logo: "/icons/bitcoin-btc-logo.png",
    rawAmount: totalDebt,
    decimals: 8,
    amount: formattedDebt,
  };

  const ETH_PRICE = eth?.price ?? 0;
  const BTC_PRICE = btc?.price ?? 0;

  return (
    <Card className="h-full w-full">
      <Heading className="text-xl font-bold">Your Position</Heading>
      <div className="grid grid-cols-2 gap-4">
        <SuppliedPosition
          asset={suppliedAsset}
          address={address}
          maxWithdraw={totalCollateral}
        />

        <BorrowedPosition asset={borrowedAsset} address={address} />

        <PositionStats
          collateralValue={(Number(formattedCollateral) * ETH_PRICE).toFixed(2)}
          borrowedValue={(Number(formattedDebt) * BTC_PRICE).toFixed(2)}
          availableToBorrow={(Number(formattedAvailable) * ETH_PRICE).toFixed(
            2
          )}
        />

        <div className="col-span-2 p-4  rounded-lg mt-2">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Position Health</h4>
              <p className="text-sm text-gray-600 mt-1">
                Liquidation at &lt; 1.0 health factor
              </p>
            </div>
            <HealthFactor healthFactor={healthFactor} />
          </div>
        </div>
      </div>
    </Card>
  );
};
