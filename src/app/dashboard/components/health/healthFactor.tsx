import { Card } from "@radix-ui/themes";
import { formatHealthFactor, getHealthFactorColor } from "../../utils/format";

interface HealthFactorDisplayProps {
  healthFactor?: bigint;
}

export const HealthFactor = ({ healthFactor }: HealthFactorDisplayProps) => {
  const displayValue = formatHealthFactor(healthFactor);
  const colorClass = getHealthFactorColor(healthFactor);

  return (
    <Card>
      <p className="text-sm text-gray-500">Health Factor</p>
      <p className={`text-xl font-bold `}>{displayValue}</p>
      <p className="text-xs mt-1">
        {displayValue === "∞"
          ? "No borrowed assets"
          : displayValue >= 1.5
          ? "Position is safe"
          : displayValue >= 1.1
          ? "Monitor closely"
          : "Liquidation risk!"}
      </p>
    </Card>
  );
};
