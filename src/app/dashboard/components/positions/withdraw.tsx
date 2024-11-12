import React, { useState, useCallback, useEffect } from "react";
import { Dialog, Button, TextField, Text, Flex } from "@radix-ui/themes";
import { parseEther, formatEther } from "viem";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { ABIS, ADDRESSES } from "../../constants/constants";

interface WithdrawDialogProps {
  address?: string;
  maxWithdraw: bigint;
}

const WithdrawDialog = ({ address, maxWithdraw }: WithdrawDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  const [needsApproval, setNeedsApproval] = useState(true);

  // Check allowance
  const { data: currentAllowance } = useReadContract({
    address: ADDRESSES.SEPOLIA.AWETH,
    abi: [
      {
        inputs: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "allowance",
    args: address ? [address, ADDRESSES.SEPOLIA.WETH_GATEWAY] : undefined,
    enabled: !!address,
  });

  // Update needsApproval based on allowance
  useEffect(() => {
    if (!withdrawAmount || !currentAllowance) return;

    try {
      const weiAmount = parseEther(withdrawAmount);
      setNeedsApproval(currentAllowance < weiAmount);
    } catch (e) {
      console.error("Error checking allowance:", e);
    }
  }, [withdrawAmount, currentAllowance]);

  const {
    data: approvalHash,
    isPending: isApproving,
    writeContract: writeApproval,
  } = useWriteContract();

  const {
    data: withdrawHash,
    isPending: isWithdrawing,
    writeContract: writeWithdraw,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: withdrawHash,
    });

  const { isSuccess: isApproved } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  // Handle approval success
  useEffect(() => {
    if (isApproved) {
      setNeedsApproval(false);
    }
  }, [isApproved]);

  const handleApprove = async () => {
    if (!withdrawAmount) return;

    try {
      const amount = parseEther(withdrawAmount);

      await writeApproval({
        address: ADDRESSES.SEPOLIA.AWETH,
        abi: [
          {
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "approve",
        args: [ADDRESSES.SEPOLIA.WETH_GATEWAY, amount],
      });
    } catch (err) {
      console.error("Approval failed:", err);
      setValidationError(
        err instanceof Error
          ? err.message
          : "Approval failed. Please try again."
      );
    }
  };

  const validateAmount = useCallback(
    (amount: string): boolean => {
      setValidationError("");

      if (!amount) {
        setValidationError("Please enter an amount");
        return false;
      }

      try {
        const weiAmount = parseEther(amount);

        if (weiAmount > maxWithdraw) {
          setValidationError(
            `Amount exceeds maximum available (${formatEther(maxWithdraw)} ETH)`
          );
          return false;
        }

        if (weiAmount <= BigInt(0)) {
          setValidationError("Amount must be greater than 0");
          return false;
        }

        // Check if we need approval
        if (currentAllowance !== undefined) {
          setNeedsApproval(weiAmount > currentAllowance);
        }

        return true;
      } catch (e) {
        setValidationError("Invalid amount format");
        return false;
      }
    },
    [maxWithdraw, currentAllowance]
  );

  const handleWithdraw = async () => {
    if (!withdrawAmount || !address) return;
    if (!validateAmount(withdrawAmount)) return;

    try {
      const weiAmount = parseEther(withdrawAmount);

      await writeWithdraw({
        address: ADDRESSES.SEPOLIA.WETH_GATEWAY,
        abi: ABIS.WETH_GATEWAY,
        functionName: "withdrawETH",
        args: [ADDRESSES.SEPOLIA.POOL, weiAmount, address],
      });
    } catch (err) {
      console.error("Withdrawal failed:", err);
      setValidationError(
        err instanceof Error
          ? err.message
          : "Transaction failed. Please try again."
      );
    }
  };

  const handleSetMax = () => {
    const maxAmount = formatEther(maxWithdraw);
    setWithdrawAmount(maxAmount);
    setValidationError("");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith("-")) return;
    if (value.includes(".") && value.split(".")[1]?.length > 18) return;

    setWithdrawAmount(value);
    if (value) validateAmount(value);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          variant="surface"
          style={{ width: "100%" }}
          disabled={maxWithdraw <= 0}>
          Withdraw ETH
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Withdraw ETH</Dialog.Title>

        <Flex direction="column" gap="4" style={{ paddingBlock: "16px" }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">
              Available to Withdraw
            </Text>
            <Text weight="medium">{formatEther(maxWithdraw)} ETH</Text>
          </Flex>

          <Flex direction="column" gap="1">
            <Flex gap="2">
              <TextField.Root
                style={{ flex: 1 }}
                placeholder="Amount to withdraw"
                value={withdrawAmount}
                onChange={handleAmountChange}
                pattern="^[0-9]*[.]?[0-9]*$"
              />
              <Button variant="soft" onClick={handleSetMax}>
                Max
              </Button>
            </Flex>
            <Text size="1" color="gray">
              Max: {formatEther(maxWithdraw)} ETH
            </Text>
          </Flex>

          {validationError && (
            <Text color="red" size="2">
              {validationError}
            </Text>
          )}

          {needsApproval ? (
            <Button
              onClick={handleApprove}
              disabled={isApproving || !withdrawAmount || !!validationError}>
              {isApproving ? "Approving..." : "Approve Withdrawal"}
            </Button>
          ) : (
            <Button
              onClick={handleWithdraw}
              disabled={
                isWithdrawing ||
                isConfirming ||
                !withdrawAmount ||
                !!validationError
              }>
              {isWithdrawing || isConfirming ? "Withdrawing..." : "Withdraw"}
            </Button>
          )}

          {isConfirmed && (
            <Flex direction="column" align="center" gap="2">
              <Text color="green" weight="medium">
                Withdrawal Successful!
              </Text>
              <Button variant="soft" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </Flex>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default WithdrawDialog;
