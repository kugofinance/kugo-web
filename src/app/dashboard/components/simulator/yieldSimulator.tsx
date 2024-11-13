"use client";
import { useState } from "react";
import { Card, Heading, Tabs, Box, Flex } from "@radix-ui/themes";
import { calculateYieldMetrics } from "./calculations";
import { usePriceFeeds } from "@/app/hooks/usePriceFeeds";
import { MetricsGrid } from "./metricBox";
import { YieldChart } from "./yieldChart";
import { ComparisonRow, ComparisonTable } from "./strategyComparison";
import Image from "next/image";

export const YieldSimulator = () => {
  const [ethAmount, setEthAmount] = useState(1);
  const { eth, btc } = usePriceFeeds();

  const currentMetrics = {
    ethStakingAPY: 4.5,
    wbtcBorrowAPR: 2.8,
    maxLTV: 0.75,
    ethPriceUSD: eth?.price || 0,
    btcPriceUSD: btc?.price || 0,
    dailyEthVolatility: 0.02,
    dailyBtcVolatility: 0.025,
  };

  const metrics = calculateYieldMetrics(ethAmount, currentMetrics);

  const generateSimulationData = () => {
    const data = [];
    let currentValue = ethAmount * currentMetrics.ethPriceUSD;

    for (let day = 0; day <= 30; day++) {
      const withStrategy = currentValue + metrics.totalDailyYield * day;
      const withoutStrategy =
        currentValue +
        ((currentValue * currentMetrics.ethStakingAPY) / 365 / 100) * day;

      data.push({
        day: `Day ${day}`,
        withStrategy,
        withoutStrategy,
      });
    }
    return data;
  };

  return (
    <Card className="w-full flex-grow-0 h-full">
      <Tabs.Root defaultValue="projection">
        <Tabs.List>
          <Tabs.Trigger value="projection">Yield Projection</Tabs.Trigger>
          <Tabs.Trigger value="comparison">Strategy Comparison</Tabs.Trigger>
        </Tabs.List>

        <Box className="mt-4">
          <Tabs.Content value="projection">
            <Flex gap="6" direction={"column"}>
              <MetricsGrid
                ethAmount={ethAmount}
                setEthAmount={setEthAmount}
                metrics={metrics}
              />
              <Box className="w-2/3">
                <YieldChart data={generateSimulationData()} />
              </Box>
            </Flex>
          </Tabs.Content>

          <Tabs.Content
            value="comparison"
            className="flex-grow-0 max-w-[600px]">
            <div className="space-y-4 flex flex-grow-0">
              <ComparisonTable
                traditional={{
                  apy: currentMetrics.ethStakingAPY,
                  description: "Simply stake ETH and earn staking rewards",
                  pros: [
                    "Lower risk",
                    "Simple strategy",
                    "No liquidation risk",
                  ],
                  cons: [
                    "Lower potential returns",
                    "No leverage benefits",
                    "Missing BTC upside exposure",
                  ],
                }}
                yield={{
                  apy: metrics.annualizedAPY,
                  description:
                    "Stake ETH, borrow BTC, benefit from both assets",
                  pros: [
                    "Higher potential returns",
                    "Exposure to both ETH and BTC",
                    "Leveraged upside potential",
                  ],
                  cons: [
                    "Higher risk",
                    "Liquidation risk if ETH drops significantly",
                    "More complex strategy",
                  ],
                }}
              />
            </div>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Card>
  );
};
