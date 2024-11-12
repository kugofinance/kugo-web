import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { formatAaveAmount } from "../../utils/format";

interface AssetDisplayProps {
  type: "supplied" | "borrowed";
  asset: {
    symbol: string;
    logo: string;
    rawAmount: bigint;
    decimals: number;
    apy: string;
  };
}

export const AssetDisplay = ({ type, asset }: AssetDisplayProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <img src={asset.logo} alt={asset.symbol} className="w-6 h-6" />
          <span className="font-medium">{asset.symbol}</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {type === "supplied" ? "APY" : "APR"}: {asset.apy}%
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">
          {asset.amount} {asset.symbol}
        </div>
        <div
          className={`text-sm ${
            type === "supplied" ? "text-green-600" : "text-yellow-600"
          }`}>
          {type === "supplied" ? (
            <>
              <ArrowUpIcon className="inline h-3 w-3 mr-1" />
              Earning
            </>
          ) : (
            <>
              <ArrowDownIcon className="inline h-3 w-3 mr-1" />
              Borrowing
            </>
          )}
        </div>
      </div>
    </div>
  );
};
