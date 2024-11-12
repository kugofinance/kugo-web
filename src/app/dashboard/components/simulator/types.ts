export interface YieldMetrics {
  ethStakingAPY: number;
  wbtcBorrowAPR: number;
  maxLTV: number; // Loan to Value ratio (usually 75-80% for ETH)
  ethPriceUSD: number;
  btcPriceUSD: number;
  dailyEthVolatility: number; // Historical daily volatility
  dailyBtcVolatility: number;
}
