// import { Client, cacheExchange, fetchExchange } from "urql";

// interface OHLCV {
//   timestamp: number;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume: number;
// }

// export class TokenPriceTracker {
//   private client: Client;
//   private poolId: string;

//   constructor(poolId: string) {
//     // Using Uniswap v3 subgraph
//     this.client = new Client({
//       url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
//       exchanges: [cacheExchange, fetchExchange],
//     });
//     this.poolId = poolId.toLowerCase();
//   }

//   async getOHLCVData(hoursBack: number = 4): Promise<OHLCV[]> {
//     try {
//       console.time("OHLCV Data Fetch");

//       const currentTime = Math.floor(Date.now() / 1000);
//       const startTime = currentTime - hoursBack * 60 * 60;

//       const query = `
//                 query PoolData($poolId: String!, $startTime: Int!) {
//                     poolHourData(
//                         where: {
//                             pool: $poolId,
//                             periodStartUnix_gte: $startTime
//                         }
//                         orderBy: periodStartUnix
//                         orderDirection: desc
//                     ) {
//                         periodStartUnix
//                         open
//                         high
//                         low
//                         close
//                         volumeUSD
//                     }
//                 }
//             `;

//       const response = await this.client
//         .query(query, {
//           poolId: this.poolId,
//           startTime: startTime,
//         })
//         .toPromise();

//       if (!response.data) {
//         throw new Error("No data returned from The Graph");
//       }

//       const ohlcvData: OHLCV[] = response.data.poolHourData.map((d: any) => ({
//         timestamp: parseInt(d.periodStartUnix),
//         open: parseFloat(d.open),
//         high: parseFloat(d.high),
//         low: parseFloat(d.low),
//         close: parseFloat(d.close),
//         volume: parseFloat(d.volumeUSD),
//       }));

//       console.timeEnd("OHLCV Data Fetch");
//       return ohlcvData.sort((a, b) => a.timestamp - b.timestamp);
//     } catch (error) {
//       console.error("Error getting OHLCV data:", error);
//       throw error;
//     }
//   }
// }

// // Example usage
// export async function main() {
//   // USDC/ETH pool on Uniswap v3 (0.3% fee tier)
//   const poolId = "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8";

//   const tracker = new TokenPriceTracker(poolId);

//   try {
//     const ohlcvData = await tracker.getOHLCVData(4);

//     console.log("OHLCV Data:");
//     ohlcvData.forEach((candle) => {
//       console.log({
//         ...candle,
//         time: new Date(candle.timestamp * 1000).toLocaleString(),
//         price: candle.close.toFixed(2),
//         volume: `$${Math.round(candle.volume).toLocaleString()}`,
//       });
//     });

//     console.log(`Total intervals: ${ohlcvData.length}`);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// // Run the example
// main();
