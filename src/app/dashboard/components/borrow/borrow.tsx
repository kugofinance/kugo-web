import { Button, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { parseUnits } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ADDRESSES, ABIS } from "../../constants/constants";

interface BorrowFormProps {
  address?: string;
  maxBorrow?: bigint;
}

export const BorrowForm = ({ address, maxBorrow }: BorrowFormProps) => {
  const [borrowAmount, setBorrowAmount] = useState("");

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleBorrow = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!borrowAmount || !address) return;

    writeContract({
      address: ADDRESSES.SEPOLIA.POOL,
      abi: ABIS.POOL,
      functionName: "borrow",
      args: [
        ADDRESSES.SEPOLIA.WBTC,
        parseUnits(borrowAmount, 8), // WBTC has 8 decimals
        2, // Variable interest rate mode
        0, // referral code
        address,
      ],
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">2. Borrow WBTC</h3>
      <form onSubmit={handleBorrow} className="flex gap-2">
        <TextField.Root
          type="number"
          placeholder="Amount in WBTC"
          value={borrowAmount}
          onChange={(e) => setBorrowAmount(e.target.value)}
        />
        <Button type="submit" disabled={isPending || isConfirming}>
          {isConfirming ? "Borrowing..." : "Borrow"}
        </Button>
      </form>
      {error && (
        <div className="text-red-500 text-sm mt-2">{error.message}</div>
      )}
    </div>
  );
};
