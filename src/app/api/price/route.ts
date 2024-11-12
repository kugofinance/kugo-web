// app/api/token-metrics/route.ts
import { NextResponse } from "next/server";

interface TokenPrice {
  price: number;
  priceChain: number;
  price5m: number;
  priceChain5m: number;
  variation5m: number;
  price1h: number;
  priceChain1h: number;
  variation1h: number;
  price6h: number;
  priceChain6h: number;
  variation6h: number;
  price24h: number;
  priceChain24h: number;
  variation24h: number;
}

export async function GET() {
  try {
    // Get your DEXTOOLS API key from environment variables
    const apiKey = process.env.DEXTOOLS_API_KEY;

    if (!apiKey) {
      throw new Error("DEXTOOLS_API_KEY is not defined");
    }

    // Make request to Dextools API
    const response = await fetch(
      `https://public-api.dextools.io/standard/v2/token/ether/0xC5903ceD3c193B89Cbbb5a0aF584494c3D5D289d/price`, // Replace with your token address
      {
        headers: {
          "X-API-Key": apiKey,
          Accept: "application/json",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch token metrics");
    }

    const data = await response.json();
    const price: TokenPrice = {
      price: data.data.price || 0,
      priceChain: data.data.priceChain || 0,
      price5m: data.data.price5m || 0,
      priceChain5m: data.data.priceChain5m || 0,
      variation5m: data.data.variation5m || null,
      // variationChain5m: data.data.variationChain5m || null,
      price1h: data.data.price1h || 0,
      priceChain1h: data.data.priceChain1h || 0,
      variation1h: data.data.variation1h || null,
      price6h: data.data.price6h || 0,
      priceChain6h: data.data.priceChain6h || 0,
      variation6h: data.data.variation6h || null,
      price24h: data.data.price24h || 0,
      priceChain24h: data.data.priceChain24h || 0,
      variation24h: data.data.variation24h || null,
    };

    return NextResponse.json(price);
  } catch (error) {
    console.error("Error fetching token price:", error);
    return NextResponse.json(
      { error: "Failed to fetch token metrics" },
      { status: 500 }
    );
  }
}

// Helper functions for formatting
function formatCurrency(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

function formatNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toString();
}
