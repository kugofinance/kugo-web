export const calculateYieldMetrics = (
  ethAmount: number,
  metrics: YieldMetrics
) => {
  // Calculate collateral value and maximum borrowing power
  const collateralValueUSD = ethAmount * metrics.ethPriceUSD;
  const maxBorrowUSD = collateralValueUSD * metrics.maxLTV;
  const maxBorrowBTC = maxBorrowUSD / metrics.btcPriceUSD;

  // Daily earnings from ETH staking
  const dailyStakingReturn =
    (collateralValueUSD * metrics.ethStakingAPY) / 365 / 100;

  // Daily borrowing cost for WBTC
  const dailyBorrowingCost = (maxBorrowUSD * metrics.wbtcBorrowAPR) / 365 / 100;

  // Potential daily profit from price movements
  // If BTC rises more than ETH in a day, you profit
  const btcPositionValue = maxBorrowUSD;
  const potentialDailyPriceGain =
    btcPositionValue *
    (metrics.dailyBtcVolatility - metrics.dailyEthVolatility);

  // Total potential daily yield
  const totalDailyYield =
    dailyStakingReturn - dailyBorrowingCost + potentialDailyPriceGain;

  // Annualized yield (simple)
  const annualizedYield = totalDailyYield * 365;
  const annualizedAPY = (annualizedYield / collateralValueUSD) * 100;

  return {
    collateralValueUSD,
    maxBorrowUSD,
    maxBorrowBTC,
    dailyStakingReturn,
    dailyBorrowingCost,
    potentialDailyPriceGain,
    totalDailyYield,
    annualizedYield,
    annualizedAPY,
  };
};
