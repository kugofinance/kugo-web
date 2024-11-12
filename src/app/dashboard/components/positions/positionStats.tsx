interface PositionStatsProps {
  collateralValue: string;
  borrowedValue: string;
  availableToBorrow: string;
}

export const PositionStats = ({
  collateralValue,
  borrowedValue,
  availableToBorrow,
}: PositionStatsProps) => (
  <div className="col-span-2 grid grid-cols-3 gap-4 mt-2">
    <div className="p-3  rounded-lg">
      <div className="text-sm text-gray-500">Collateral Value</div>
      <div className="text-lg font-medium">${collateralValue}</div>
    </div>
    <div className="p-3  rounded-lg">
      <div className="text-sm text-gray-500">Borrowed Value</div>
      <div className="text-lg font-medium">${borrowedValue}</div>
    </div>
    <div className="p-3  rounded-lg">
      <div className="text-sm text-gray-500">Available to Borrow</div>
      <div className="text-lg font-medium">${availableToBorrow}</div>
    </div>
  </div>
);
