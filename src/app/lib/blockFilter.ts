import { ethers } from "ethers";
import pLimit from "p-limit";

const PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function decimals() external view returns (uint8)",
];

interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PriceVolume {
  price: number;
  volume: number;
  timestamp: number;
}

export class TokenPriceTracker {
  private provider: ethers.JsonRpcProvider;
  private pairContract: ethers.Contract;
  private limit: ReturnType<typeof pLimit>;

  constructor(
    infuraUrl: string,
    pairAddress: string,
    concurrentLimit: number = 5
  ) {
    this.provider = new ethers.JsonRpcProvider(infuraUrl);
    this.pairContract = new ethers.Contract(
      pairAddress,
      PAIR_ABI,
      this.provider
    );
    this.limit = pLimit(concurrentLimit);
  }

  private async processEvent(event: ethers.Log): Promise<PriceVolume | null> {
    try {
      const [block, reserves] = await Promise.all([
        this.provider.getBlock(event.blockNumber),
        this.pairContract.getReserves({ blockTag: event.blockNumber }),
      ]);

      if (!block || !reserves) return null;

      const reserve0 = Number(reserves[0].toString()) / 1e6; // USDC
      const reserve1 = Number(reserves[1].toString()) / 1e18; // ETH
      const price = Number((reserve0 / reserve1).toFixed(2));

      const args = event.args;
      if (!args) return null;

      const volume = Number(
        (
          (Number(args.amount0In.toString()) +
            Number(args.amount0Out.toString())) /
          1e6
        ).toFixed(2)
      );

      return {
        price,
        volume,
        timestamp: block.timestamp,
      };
    } catch (error) {
      console.error(
        `Error processing event at block ${event.blockNumber}:`,
        error
      );
      return null;
    }
  }

  private async processEventsInBatches(
    events: ethers.Log[],
    batchSize: number = 10
  ) {
    const results: PriceVolume[] = [];
    const batches = [];

    // Split events into batches
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      batches.push(batch);
    }

    // Process batches sequentially, but events within batch concurrently
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map((event) => this.limit(() => this.processEvent(event)))
      );

      results.push(...batchResults.filter((r): r is PriceVolume => r !== null));

      // Optional: Add small delay between batches to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
  }

  async getOHLCVData(hoursBack: number = 4): Promise<OHLCV[]> {
    try {
      console.time("OHLCV Data Fetch");
      const FIVE_MINUTES = 5 * 60;
      const endBlock = await this.provider.getBlockNumber();

      // Calculate approximate start block
      const blocksPerHour = (60 * 60) / 12; // ~12 second blocks
      const startBlock = endBlock - Math.floor(blocksPerHour * hoursBack);

      console.log(`Fetching events from block ${startBlock} to ${endBlock}`);

      const swapFilter = this.pairContract.filters.Swap();
      const events = await this.pairContract.queryFilter(
        swapFilter,
        startBlock,
        endBlock
      );

      console.log(`Processing ${events.length} events...`);

      // Process events in batches with rate limiting
      const processedEvents = await this.processEventsInBatches(events, 10);

      // Group events into 5-minute intervals
      const intervals: {
        [key: number]: {
          prices: number[];
          volumes: number[];
        };
      } = {};

      processedEvents.forEach(({ price, volume, timestamp }) => {
        const intervalStart =
          Math.floor(timestamp / FIVE_MINUTES) * FIVE_MINUTES;

        if (!intervals[intervalStart]) {
          intervals[intervalStart] = {
            prices: [],
            volumes: [],
          };
        }

        intervals[intervalStart].prices.push(price);
        intervals[intervalStart].volumes.push(volume);
      });

      // Convert to OHLCV format
      const ohlcvData = Object.entries(intervals)
        .map(([timestamp, { prices, volumes }]) => ({
          timestamp: parseInt(timestamp),
          open: prices[0],
          high: Math.max(...prices),
          low: Math.min(...prices),
          close: prices[prices.length - 1],
          volume: volumes.reduce((a, b) => a + b, 0),
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      console.timeEnd("OHLCV Data Fetch");
      return ohlcvData;
    } catch (error) {
      console.error("Error getting OHLCV data:", error);
      throw error;
    }
  }
}

// Example usage
async function main() {
  const infuraUrl =
    "https://mainnet.infura.io/v3/14595d4e2ad0455a921b27186be75241";
  const pairAddress = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc"; // USDC/ETH

  const tracker = new TokenPriceTracker(
    infuraUrl,
    pairAddress,
    5 // Concurrent request limit
  );

  try {
    // Get last 4 hours of data
    const ohlcvData = await tracker.getOHLCVData(4);

    console.log("OHLCV Data:");
    ohlcvData.forEach((candle) => {
      console.log({
        ...candle,
        time: new Date(candle.timestamp * 1000).toLocaleString(),
      });
    });

    console.log(`Total candles: ${ohlcvData.length}`);
  } catch (error) {
    console.error("Error:", error);
  }
}
