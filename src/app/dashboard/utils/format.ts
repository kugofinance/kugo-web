import { formatEther, formatUnits } from "viem";

export const formatHealthFactor = (healthFactor?: bigint) => {
  if (!healthFactor) return "0";
  const number = Number(formatEther(healthFactor));
  if (number > 1e10) return "∞";
  return number.toFixed(2);
};

export const getHealthFactorColor = (healthFactor?: bigint) => {
  const number = Number(formatEther(healthFactor || BigInt(0)));
  if (number > 1e10) return "text-green-600";
  if (number >= 2) return "text-green-600";
  if (number >= 1.5) return "text-blue-600";
  if (number >= 1.1) return "text-yellow-600";
  return "text-red-600";
};

export const formatAPY = (rate?: bigint) => {
  if (!rate) return "0";
  return (Number(formatUnits(rate, 27)) * 100).toFixed(2);
};

const RAY = 10n ** 27n;
const WAD = 10n ** 18n;
const BASIS_POINTS_DECIMALS = 4;

export const formatAaveNumber = (
  value: bigint | undefined,
  decimals: number = 2
): string => {
  if (!value) return "0";

  const formatted = Number(formatUnits(value, decimals));
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(formatted);
};

export const formatAaveMetrics = {
  // For collateral, debt, and borrow amounts (base units, 8 decimals)
  formatBaseUnits: (value: bigint | undefined): string => {
    return formatAaveNumber(value, 8);
  },

  // For health factor (ray units, 27 decimals)
  formatHealthFactor: (value: bigint | undefined): string => {
    if (!value) return "0";
    const normalized = value / (RAY / WAD); // Convert to 18 decimals
    return formatAaveNumber(normalized, 18);
  },

  // For LTV and liquidation threshold (basis points, need to convert to percentages)
  formatBasisPoints: (value: bigint | undefined): string => {
    if (!value) return "0";
    const percentage = Number(value) / 100;
    return percentage.toFixed(2);
  },
};

export const formatTokenToUSD = (
  amount: bigint | undefined,
  decimals: number,
  priceUSD: number
): string => {
  if (!amount) return "0.00";

  const tokenAmount = Number(formatUnits(amount, decimals));
  const usdValue = tokenAmount * priceUSD;

  return usdValue.toFixed(2);
};

export const calculateValueWithPriceImpact = (
  amount: bigint,
  decimals: number,
  currentPrice: number,
  priceImpactPercentage: number = 0.5 // 0.5% default slippage
): { value: number; priceImpact: number } => {
  const tokenAmount = Number(formatUnits(amount, decimals));
  const valueAtCurrentPrice = tokenAmount * currentPrice;
  const priceImpact = valueAtCurrentPrice * (priceImpactPercentage / 100);

  return {
    value: valueAtCurrentPrice,
    priceImpact,
  };
};
