import { formatUnits } from "viem";
import { AssetDisplay } from "./assets";
import RepaymentDialog from "./repayment";
import { Asset } from "./types";

interface BorrowedPositionProps {
  asset: Asset;
  address?: string;
}

export const BorrowedPosition = ({ asset, address }: BorrowedPositionProps) => {
  return (
    <div className="p-4  rounded-lg">
      <h3 className="text-sm text-gray-500 mb-3">Borrowed Assets</h3>
      <AssetDisplay
        type="borrowed"
        asset={asset} // Use the pre-formatted amount from props
      />
      <div className="mt-4 flex gap-2">
        <RepaymentDialog
          address={address}
          currentDebt={asset.amount}
          onRepay={undefined}
        />
      </div>
    </div>
  );
};
