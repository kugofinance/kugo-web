// app/api/swap-quote/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellAmount, address, slippage } = body;
    const TOKEN_ADDRESS = "0xC5903ceD3c193B89Cbbb5a0aF584494c3D5D289d";

    const response = await fetch(
      `https://api.0x.org/swap/permit2/quote?${new URLSearchParams({
        sellToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        buyToken: TOKEN_ADDRESS,
        sellAmount: sellAmount,
        taker: address,
        chainId: "1",
        slippagePercentage: slippage.toString(),
      })}`,
      {
        headers: {
          "0x-api-key": process.env.SWAP_0X_API || "",
          "0x-version": "v2",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Swap quote error:", error);
    return NextResponse.json(
      { error: "Failed to fetch swap quote" },
      { status: 500 }
    );
  }
}
