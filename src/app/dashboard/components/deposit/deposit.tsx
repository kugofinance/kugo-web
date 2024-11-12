import { Button, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { parseEther } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ADDRESSES, ABIS } from "../../constants/constants";

interface DepositFormProps {
  address?: string;
  balance?: bigint;
}

export const DepositForm = ({ address, balance }: DepositFormProps) => {
  const [depositAmount, setDepositAmount] = useState("");

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleDeposit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!depositAmount || !address) return;

    writeContract({
      address: ADDRESSES.SEPOLIA.WETH_GATEWAY,
      abi: ABIS.WETH_GATEWAY,
      functionName: "depositETH",
      args: [ADDRESSES.SEPOLIA.POOL, address, 0],
      value: parseEther(depositAmount),
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">1. Deposit ETH as Collateral</h3>
      <form onSubmit={handleDeposit} className="flex gap-2">
        <TextField.Root
          type="number"
          placeholder="Amount in ETH"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
        <Button type="submit" disabled={isPending || isConfirming}>
          {isConfirming ? "Depositing..." : "Deposit"}
        </Button>
      </form>
      {error && (
        <div className="text-red-500 text-sm mt-2">{error.message}</div>
      )}
    </div>
  );
};
