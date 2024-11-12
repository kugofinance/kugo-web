import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get your DEXTOOLS API key from environment variables
    const apiKey = process.env.DEXTOOLS_API_KEY;

    if (!apiKey) {
      throw new Error("DEXTOOLS_API_KEY is not defined");
    }

    // Make request to Dextools API
    const response = await fetch(
      `https://public-api.dextools.io/standard/v2/token/ether/0xC5903ceD3c193B89Cbbb5a0aF584494c3D5D289d/info`, // Replace with your token address
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
    const { data } = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching token metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch token metrics" },
      { status: 500 }
    );
  }
}
