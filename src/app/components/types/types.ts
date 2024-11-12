export interface Candlestick {
  time: number; // Unix timestamp
  open: number; // Opening price in USD
  high: number; // Highest price in USD
  low: number; // Lowest price in USD
  close: number; // Closing price in USD
  volume: number; // Trading volume
}
