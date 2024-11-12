import { useState, useEffect } from "react";
import { TokenPrice } from "./types";
import { PriceSparkline } from "./priceSparkline";
import { Card } from "@radix-ui/themes";
import { TokenMetricsGrid } from "../tokenInfo/metricsGrid";

const formatPrice = (price: number) => {
  if (price < 0.00001) {
    // For very small numbers, use scientific notation
    return price.toExponential(6);
  } else if (price < 1) {
    // For small numbers, show enough decimal places
    return price.toFixed(Math.min(10, -Math.floor(Math.log10(price)) + 4));
  } else {
    // For numbers >= 1, use standard formatting
    return price.toFixed(2);
  }
};

const formatVariation = (variation: number | null) => {
  if (variation === null) return <span className="text-gray-400">N/A</span>;

  const isPositive = variation >= 0;
  // Handle large percentage changes
  const formattedValue =
    Math.abs(variation) > 1000
      ? `${Math.round(variation)}`
      : variation?.toFixed(2);

  return (
    <span
      className={`${
        isPositive ? "text-green-500" : "text-red-500"
      } font-medium`}>
      {isPositive ? "↑" : "↓"} {formattedValue}%
    </span>
  );
};

export function PriceDisplay() {
  const [priceData, setPriceData] = useState<TokenPrice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/price");
        if (!response.ok) throw new Error("Failed to fetch price data");
        const data = await response.json();
        setPriceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch price");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatVariation = (variation: number | null) => {
    if (variation === null) return <span className="text-gray-400">N/A</span>;

    const isPositive = variation >= 0;
    return (
      <span className={`${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? "↑" : "↓"} {Math.abs(variation).toFixed(2)}%
      </span>
    );
  };

  // Create sparkline data from price history, handling null values
  const getSparklineData = (data: TokenPrice) => {
    const now = Date.now();
    const points = [
      { time: now - 24 * 60 * 60 * 1000, value: data.price24h || data.price },
      { time: now - 6 * 60 * 60 * 1000, value: data.price6h || data.price },
      { time: now - 60 * 60 * 1000, value: data.price1h || data.price },
      { time: now - 5 * 60 * 1000, value: data.price5m || data.price },
      { time: now, value: data.price },
    ].filter((point) => point.value !== null && point.value !== undefined);

    return points;
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-12 bg-gray-200 rounded w-32"></div>
        </div>
      </Card>
    );
  }

  if (error || !priceData) {
    return (
      <Card className="p-4">
        <div className="text-red-500">
          {error || "Failed to load price data"}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 ">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Current Price</h3>
          <div className="text-2xl font-bold mt-1 font-mono">
            ${formatPrice(priceData.price)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {priceData.priceChain.toExponential(6)} ETH
          </div>
          <div className="flex gap-4 mt-2">
            <div>
              <span className="text-sm text-gray-500">24h</span>
              <div className="text-sm font-medium">
                {formatVariation(priceData.variation24h)}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">1h</span>
              <div className="text-sm font-medium">
                {formatVariation(priceData.variation1h)}
              </div>
            </div>
          </div>
        </div>
        <div className="h-[100px]">
          <PriceSparkline
            data={getSparklineData(priceData)}
            color={priceData.variation24h >= 0 ? "#10B981" : "#EF4444"}
            height={100}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <PriceTimeframe
          label="5m"
          price={priceData.price5m}
          priceChain={priceData.priceChain5m}
          variation={priceData.variation5m}
          chainVariation={priceData.variationChain5m}
        />
        <PriceTimeframe
          label="1h"
          price={priceData.price1h}
          priceChain={priceData.priceChain1h}
          variation={priceData.variation1h}
          chainVariation={priceData.variationChain1h}
        />
        <PriceTimeframe
          label="6h"
          price={priceData.price6h}
          priceChain={priceData.priceChain6h}
          variation={priceData.variation6h}
          chainVariation={priceData.variationChain6h}
        />
        <PriceTimeframe
          label="24h"
          price={priceData.price24h}
          priceChain={priceData.priceChain24h}
          variation={priceData.variation24h}
          chainVariation={priceData.variationChain24h}
        />
      </div>
    </Card>
  );
}

interface PriceTimeframeProps {
  label: string;
  price: number;
  priceChain: number;
  variation: number | null;
  chainVariation: number | null;
}

function PriceTimeframe({
  label,
  price,
  priceChain,
  variation,
  chainVariation,
}: PriceTimeframeProps) {
  const formatPrice = (price: number) => {
    if (price < 0.00001) {
      return price.toExponential(6);
    } else if (price < 1) {
      return price.toFixed(Math.min(10, -Math.floor(Math.log10(price)) + 4));
    } else {
      return price.toFixed(2);
    }
  };

  return (
    <div className=" p-3 rounded-lg">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-sm font-mono mt-1">${formatPrice(price)}</div>
      <div className="text-xs text-gray-500 mt-1">
        {priceChain.toExponential(6)} ETH
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <div className="text-sm">USD: {formatVariation(variation)}</div>
        <div className="text-sm">ETH: {formatVariation(chainVariation)}</div>
      </div>
    </div>
  );
}
