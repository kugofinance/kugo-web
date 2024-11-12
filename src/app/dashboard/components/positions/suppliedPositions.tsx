import { formatUnits } from "viem";
import { AssetDisplay } from "./assets";
import WithdrawDialog from "./withdraw";
import { Asset } from "./types";

interface SuppliedPositionProps {
  asset: Asset;
  address?: string;
  maxWithdraw: bigint;
}

export const SuppliedPosition = ({
  asset,
  address,
  maxWithdraw,
}: SuppliedPositionProps) => {
  return (
    <div className="p-4  rounded-lg">
      <h3 className="text-sm text-gray-500 mb-3">Supplied Assets</h3>
      <AssetDisplay type="supplied" asset={asset} />
      <div className="mt-4 flex gap-2">
        <WithdrawDialog address={address} maxWithdraw={maxWithdraw} />
      </div>
    </div>
  );
};
