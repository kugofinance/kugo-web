// types.ts
export interface Asset {
  symbol: string;
  logo: string;
  rawAmount: bigint;
  decimals: number;
  apy: string;
}

export interface PositionManagerProps {
  address?: string;
  accountData?: readonly [
    totalCollateralBase: bigint,
    totalDebtBase: bigint,
    availableBorrowsBase: bigint,
    currentLiquidationThreshold: bigint,
    ltv: bigint,
    healthFactor: bigint
  ];
}
