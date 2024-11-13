import { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { Button, Card, Select, TextField, Callout } from "@radix-ui/themes";
import {
  CrossCircledIcon,
  UpdateIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";

// ERC20 ABI for approval
const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
] as const;

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
  const [slippage, setSlippage] = useState("0.01");
  const [customSlippage, setCustomSlippage] = useState("");
  const [showCustomSlippage, setShowCustomSlippage] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [needsApproval, setNeedsApproval] = useState(false);

  const TOKEN_ADDRESS = "0x44857b8f3a6fcfa1548570cf637fc8330683bf3d";

  // Check allowance
  const { data: allowance } = useReadContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address as `0x${string}`, quote?.allowanceTarget as `0x${string}`],
    enabled: !!address && !!quote?.allowanceTarget,
    watch: true,
  });

  // Update needsApproval when allowance changes
  useEffect(() => {
    if (allowance !== undefined && quote) {
      setNeedsApproval(allowance < BigInt(quote.sellAmount));
    }
  }, [allowance, quote]);

  const { data: ethBalance } = useBalance({
    address,
    watch: true,
  });

  // Prepare approval transaction
  const { data: approvalSimulateData } = useSimulateContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [
      quote?.allowanceTarget as `0x${string}`,
      BigInt(quote?.sellAmount || "0"),
    ],
    enabled: needsApproval && !!quote?.allowanceTarget,
  });

  // Execute approval
  const { writeContract: approve, isPending: isApproving } = useWriteContract();

  // Monitor approval transaction
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      enabled: !!txHash && needsApproval,
    });

  // Simulate the swap transaction
  const { data: simulateData } = useSimulateContract({
    address: quote?.to as `0x${string}`,
    abi: [], // 0x router doesn't need ABI
    functionName: "swap",
    value: quote?.value ? BigInt(quote.value) : BigInt(0),
    data: quote?.data as `0x${string}`,
    account: address,
    enabled: !!quote && !!address && !needsApproval,
  });

  // Execute the swap transaction
  const { writeContract: swap, isPending: isSwapping } = useWriteContract();

  // Monitor swap transaction
  const { isLoading: isSwapConfirming, isSuccess: isSwapConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      enabled: !!txHash && !needsApproval,
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

  const handleApprove = async () => {
    if (!quote?.allowanceTarget || !approvalSimulateData) return;

    try {
      const hash = await approve({
        ...approvalSimulateData,
      });

      setTxHash(hash);
    } catch (err) {
      console.error("Approval failed:", err);
      setError(err instanceof Error ? err.message : "Approval failed");
    }
  };

  const handleSwap = async () => {
    if (!quote || !simulateData) return;

    try {
      const hash = await swap({
        address: quote.to as `0x${string}`,
        data: quote.data as `0x${string}`,
        value: BigInt(quote.value),
      });

      setTxHash(hash);
    } catch (err) {
      console.error("Swap failed:", err);
      setError(err instanceof Error ? err.message : "Swap failed");
    }
  };

  const isTransacting =
    isApproving || isApprovalConfirming || isSwapping || isSwapConfirming;

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
          <Card>
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
                  {console.log(quote.buyAmount)}
                  You Receive: {formatUnits(BigInt(quote.buyAmount), 9)} KUGO
                </div>
              )}
              <div>
                Slippage Tolerance:{" "}
                {showCustomSlippage ? customSlippage : Number(slippage) * 100}%
              </div>
            </div>
          </Card>
        )}

        {error && (
          <Callout.Root color="red" variant="surface">
            <Callout.Icon>
              <CrossCircledIcon />
            </Callout.Icon>
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        {(isApprovalConfirmed || isSwapConfirmed) && (
          <Callout.Root color="green" variant="surface">
            <Callout.Icon>
              <CheckCircledIcon />
            </Callout.Icon>
            <Callout.Text>
              {isApprovalConfirmed
                ? "Approval completed!"
                : "Swap completed successfully!"}{" "}
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline">
                View on Etherscan
              </a>
            </Callout.Text>
          </Callout.Root>
        )}

        {needsApproval ? (
          <Button
            disabled={!quote || isLoading || isTransacting}
            onClick={handleApprove}
            className="w-full">
            {isApproving || isApprovalConfirming ? (
              <>
                <UpdateIcon className="animate-spin mr-2" />
                {isApproving
                  ? "Approve in Wallet..."
                  : "Confirming Approval..."}
              </>
            ) : (
              "Approve KUGO"
            )}
          </Button>
        ) : (
          <Button
            disabled={!quote || isLoading || isTransacting}
            onClick={handleSwap}
            className="w-full">
            {isLoading ? (
              <>
                <UpdateIcon className="animate-spin mr-2" />
                Getting Quote...
              </>
            ) : isSwapping || isSwapConfirming ? (
              <>
                <UpdateIcon className="animate-spin mr-2" />
                {isSwapping ? "Confirm in Wallet..." : "Confirming Swap..."}
              </>
            ) : (
              "Swap"
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}
