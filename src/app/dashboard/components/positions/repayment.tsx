import React, { useState } from "react";
import { parseUnits } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Dialog } from "@radix-ui/themes";
import { Button, Spinner, TextField } from "@radix-ui/themes";

const WBTC_ADDRESS = "0x29f2D40B0605204364af54EC677bD022dA425d03";
const POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";

const POOL_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "rateMode", type: "uint256" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
    ],
    name: "repay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const RepaymentDialog = ({ currentDebt, onRepay, address }) => {
  const [repayAmount, setRepayAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    writeContract: writeApprove,
    data: approveHash,
    error: approveError,
    isPending: isApprovePending,
  } = useWriteContract();

  const {
    writeContract: writeRepay,
    data: repayHash,
    error: repayError,
    isPending: isRepayPending,
  } = useWriteContract();

  // Wait for approve confirmation
  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  // Wait for repay confirmation
  const { isLoading: isRepayConfirming, isSuccess: isRepayConfirmed } =
    useWaitForTransactionReceipt({
      hash: repayHash,
    });

  const handleApprove = async () => {
    if (!repayAmount) return;

    try {
      setIsApproving(true);
      writeApprove({
        address: WBTC_ADDRESS,
        abi: POOL_ABI,
        functionName: "approve",
        args: [POOL_ADDRESS, parseUnits(repayAmount, 8)],
      });
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleRepay = async () => {
    if (!repayAmount) return;

    try {
      writeRepay({
        address: POOL_ADDRESS,
        abi: POOL_ABI,
        functionName: "repay",
        args: [
          WBTC_ADDRESS,
          parseUnits(repayAmount, 8),
          2, // Variable rate mode
          address,
        ],
      });
    } catch (error) {
      console.error("Repayment failed:", error);
    }
  };

  const isApproveStep = !isApproveConfirmed && !isRepayConfirmed;
  const isRepayStep = isApproveConfirmed && !isRepayConfirmed;
  const isDone = isRepayConfirmed;
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger disabled={Number(currentDebt) >= 0}>
        <Button variant="surface">Repay WBTC</Button>
      </Dialog.Trigger>

      <Dialog.Content className="DialogContent">
        <Dialog.Title>Repay WBTC</Dialog.Title>

        <div style={{ display: "grid", gap: "16px", paddingBlock: "16px" }}>
          <div>
            <div style={{ fontSize: "14px", color: "var(--gray-11)" }}>
              Current Debt
            </div>
            <div style={{ fontWeight: "500" }}>{currentDebt} WBTC</div>
          </div>

          <div>
            <TextField.Root
              type="number"
              placeholder="Amount to repay"
              value={repayAmount}
              onChange={(e) => setRepayAmount(e.target.value)}
            />
            <div
              style={{
                fontSize: "12px",
                color: "var(--gray-11)",
                marginTop: "4px",
              }}>
              Max: {currentDebt} WBTC
            </div>
          </div>

          {(approveError || repayError) && (
            <div style={{ color: "var(--red-9)", fontSize: "14px" }}>
              Error: {(approveError || repayError)?.message}
            </div>
          )}

          {isApproveStep && (
            <Button
              onClick={handleApprove}
              disabled={
                !repayAmount || isApprovePending || isApproveConfirming
              }>
              {isApprovePending || isApproveConfirming ? (
                <Spinner />
              ) : (
                "Approve WBTC"
              )}
            </Button>
          )}

          {isRepayStep && (
            <Button
              onClick={handleRepay}
              disabled={isRepayPending || isRepayConfirming}>
              {isRepayPending || isRepayConfirming ? <Spinner /> : "Repay WBTC"}
            </Button>
          )}

          {isDone && (
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "var(--green-9)", fontWeight: "500" }}>
                Repayment Successful!
              </div>
              <Button variant="soft" style={{ marginTop: "8px" }}>
                Close
              </Button>
            </div>
          )}

          <div
            style={{
              fontSize: "12px",
              color: "var(--gray-11)",
              marginTop: "8px",
            }}>
            {isApproveStep && "Step 1/2: Approve WBTC for repayment"}
            {isRepayStep && "Step 2/2: Repay WBTC"}
            {isDone && "Transaction completed successfully"}
          </div>
        </div>

        {/* <Dialog.Close /> */}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RepaymentDialog;
