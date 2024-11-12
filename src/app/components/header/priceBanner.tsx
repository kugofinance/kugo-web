"use client";
import { usePriceFeeds } from "@/app/hooks/usePriceFeeds";
import { Card, Text } from "@radix-ui/themes";

export const PriceBanner = () => {
  const { eth, btc, isError, isLoading } = usePriceFeeds();
  console.log(eth);
  if (isLoading) {
    return <div>Loading prices...</div>;
  }

  if (isError) {
    return <div>Error fetching prices</div>;
  }

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-cente gap-8 items-baseline ">
        <div className="flex gap-4">
          <div className="flex gap-2 items-baseline">
            <Text size="1" color="gray">
              ETH/USD
            </Text>
            <Text size="2" weight="bold">
              ${eth?.price.toFixed(2)}
              {eth?.isStale && (
                <span className="text-yellow-500 text-sm ml-2">(Stale)</span>
              )}
            </Text>
          </div>
          <div className="flex gap-2 items-baseline">
            <Text size="1" color="gray">
              BTC/USD
            </Text>
            <Text size="2" weight="bold">
              ${btc?.price.toFixed(2)}
              {btc?.isStale && (
                <span className="text-yellow-500 text-sm ml-2">(Stale)</span>
              )}
            </Text>
          </div>
        </div>
        <Text size="1" color="gray">
          Last updated: {eth?.lastUpdated.toLocaleTimeString()}
        </Text>
        {/* <CountdownTimer /> */}
      </div>
    </Card>
  );
};
