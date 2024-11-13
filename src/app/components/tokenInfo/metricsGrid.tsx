import { useEffect, useState } from "react";
import { TokenMetrics } from "./types";
import { Card, DataList, Heading, Separator } from "@radix-ui/themes";

export function TokenMetricsGrid() {
  const [metrics, setMetrics] = useState<TokenMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/tokenInfo");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        console.error("Fetch metrics error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch metrics"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 -b-2 -gray-900"></div>
          <p className="mt-2">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50  -red-200 rounded-md">
        <h3 className="text-red-800 font-medium">Error loading metrics</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-4 bg-yellow-50  -yellow-200 rounded-md">
        <p className="text-yellow-800">No metrics data available</p>
      </div>
    );
  }

  return (
    <Card className="min-w-max">
      <Heading>KUGO TOKEN METRICS</Heading>
      <Separator className="w-full my-4" />
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Market Cap</DataList.Label>
          <DataList.Value>{formatCurrency(metrics.mcap)}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>FDV</DataList.Label>
          <DataList.Value>{formatCurrency(metrics.fdv)}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Holders</DataList.Label>
          <DataList.Value>{formatNumber(metrics.holders)}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Transactions</DataList.Label>
          <DataList.Value>{formatNumber(metrics.transactions)}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Circulating Supply</DataList.Label>
          <DataList.Value>
            {formatNumber(metrics.circulatingSupply)}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Total Supply</DataList.Label>
          <DataList.Value>{formatNumber(metrics.totalSupply)}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Card>
  );
}

// Utility functions remain the same
function formatCurrency(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9)?.toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6)?.toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3)?.toFixed(2)}K`;
  return `$${value?.toFixed(2)}`;
}

function formatNumber(value: number): string {
  if (value >= 1e9) return `${(value / 1e9)?.toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6)?.toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3)?.toFixed(2)}K`;
  return value?.toLocaleString();
}
