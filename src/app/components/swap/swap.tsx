// components/Swap/ZeroXSwap.tsx
import { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  usePrepareTransactionRequest,
  useWriteContract,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { Button, Card, Select, Spinner, TextField } from "@radix-ui/themes";

interface SwapQuote {
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  sources: unknown[];
  allowanceTarget: string;
}

const SLIPPAGE_OPTIONS = [
  { value: "0.001", label: "0.1%" },
  { value: "0.005", label: "0.5%" },
  { value: "0.01", label: "1.0%" },
  { value: "0.02", label: "2.0%" },
  { value: "custom", label: "Custom" },
];

export function ZeroXSwap() {
  const { address } = useAccount();
  const [amount, setAmount] = useState<string>("");
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slippage, setSlippage] = useState("0.01"); // Default 1%
  const [customSlippage, setCustomSlippage] = useState("");
  const [showCustomSlippage, setShowCustomSlippage] = useState(false);

  const TOKEN_ADDRESS = "0xC5903ceD3c193B89Cbbb5a0aF584494c3D5D289d";

  const { data: ethBalance } = useBalance({
    address,
    watch: true,
  });

  const fetchQuote = async () => {
    if (!amount || !address) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentSlippage = showCustomSlippage
        ? (Number(customSlippage) / 100).toString()
        : slippage;

      const response = await fetch("/api/swap-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellAmount: parseUnits(amount, 18).toString(),
          address,
          slippage: currentSlippage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }

      const quoteData = await response.json();
      setQuote(quoteData);
    } catch (err) {
      console.error("Error fetching quote:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch quote");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (amount) {
      const debounce = setTimeout(() => {
        fetchQuote();
      }, 500);

      return () => clearTimeout(debounce);
    }
  }, [amount, address, slippage, customSlippage]);

  const handleSlippageChange = (value: string) => {
    if (value === "custom") {
      setShowCustomSlippage(true);
    } else {
      setShowCustomSlippage(false);
      setSlippage(value);
    }
  };

  const { config } = usePrepareTransactionRequest({
    address: quote?.to as `0x${string}`,
    abi: [],
    functionName: "swap",
    data: quote?.data as `0x${string}`,
    value: quote?.value ? BigInt(quote.value) : BigInt(0),
    enabled: !!quote,
  });

  const { write: swap, isLoading: isSwapping } = useWriteContract(config);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Swap ETH for KUGO</h2>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">You Pay</label>
          <TextField.Root
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            disabled={isLoading || isSwapping}
          />
          {ethBalance && (
            <div className="text-sm text-gray-500">
              Balance: {formatUnits(ethBalance.value, 18).slice(0, 6)} ETH
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Slippage Tolerance</label>
          <div className="flex gap-2">
            <Select.Root
              value={showCustomSlippage ? "custom" : slippage}
              onValueChange={handleSlippageChange}>
              <Select.Trigger className="w-[180px]">
                {/* <Select.Label placeholder="Select slippage" /> */}
              </Select.Trigger>
              <Select.Content>
                {SLIPPAGE_OPTIONS.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            {showCustomSlippage && (
              <div className="flex-1">
                <TextField.Root
                  type="number"
                  placeholder="Custom slippage %"
                  value={customSlippage}
                  onChange={(e) => setCustomSlippage(e.target.value)}
                  min="0.01"
                  max="50"
                  step="0.1"
                />
              </div>
            )}
          </div>
        </div>

        {quote && (
          <div className="mt-4 p-4 bg-black rounded-lg">
            <h3 className="text-sm font-medium">Swap Quote</h3>
            <div className="mt-2 space-y-2 text-sm">
              {quote.estimatedPriceImpact && (
                <div>
                  Price Impact: {Number(quote.estimatedPriceImpact).toFixed(2)}%
                </div>
              )}
              {quote.estimatedGas && (
                <div>
                  Gas Estimate:{" "}
                  {formatUnits(BigInt(quote.estimatedGas), "gwei")} GWEI
                </div>
              )}
              {quote.buyAmount && (
                <div>
                  You Receive: {formatUnits(BigInt(quote.buyAmount), 18)} Tokens
                </div>
              )}
              <div>
                Slippage Tolerance:{" "}
                {showCustomSlippage ? customSlippage : Number(slippage) * 100}%
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button
          className="w-full"
          disabled={!quote || isLoading || isSwapping || !swap}
          onClick={() => swap?.()}>
          {isLoading || isSwapping ? (
            <>
              <Spinner />
              {isLoading ? "Getting Quote..." : "Swapping..."}
            </>
          ) : (
            "Swap"
          )}
        </Button>

        {/* <div className="text-xs text-gray-500">Powered by 0x Protocol</div> */}
      </div>
    </Card>
  );
}
