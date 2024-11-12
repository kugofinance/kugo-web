import { useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { ABIS, ADDRESSES } from "../dashboard/constants/constants";

export interface PriceFeedData {
  price: number;
  lastUpdated: Date;
  isStale: boolean;
}

export const usePriceFeeds = () => {
  const {
    data: priceData,
    isError,
    isLoading,
  } = useReadContracts({
    contracts: [
      {
        address: ADDRESSES.PRICE_FEEDS.ETH_USD,
        abi: ABIS.CHAINLINK_FEED,
        functionName: "latestRoundData",
      },
      {
        address: ADDRESSES.PRICE_FEEDS.BTC_USD,
        abi: ABIS.CHAINLINK_FEED,
        functionName: "latestRoundData",
      },
    ],
  });

  console.log(priceData);

  const processPrice = (data: any): PriceFeedData | null => {
    if (!data?.result) return null;

    // Access the result array from the data
    const [roundId, answer, startedAt, updatedAt, answeredInRound] =
      data.result;

    const lastUpdated = new Date(Number(updatedAt) * 1000);
    const price = Number(formatUnits(answer, 8)); // Chainlink uses 8 decimals

    // Check if price is stale (older than 1 hour)
    const isStale = Date.now() - lastUpdated.getTime() > 60 * 60 * 1000;

    return {
      price,
      lastUpdated,
      isStale,
    };
  };

  return {
    eth: processPrice(priceData?.[0]),
    btc: processPrice(priceData?.[1]),
    isError,
    isLoading,
  };
};
