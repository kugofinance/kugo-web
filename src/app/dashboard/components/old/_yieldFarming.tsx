// import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
// import {
//   Button,
//   Callout,
//   Card,
//   Heading,
//   Separator,
//   Spinner,
//   TextField,
//   Text,
// } from "@radix-ui/themes";
// import React, { useState } from "react";
// import { parseEther, formatEther, parseUnits } from "viem";
// import {
//   useAccount,
//   useBalance,
//   useReadContract,
//   useWaitForTransactionReceipt,
//   useWriteContract,
// } from "wagmi";
// import PositionManager from "./old/_positionsManagement";

// // // Aave V3 Ethereum addresses
// // const POOL_ADDRESS = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
// // const WETH_GATEWAY = "0xD322A49006FC828F9B5B37Ab215F99B4E5caB19C";
// // const WBTC_ADDRESS = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

// export const formatHealthFactor = (healthFactor) => {
//   if (!healthFactor) return "0";

//   const number = Number(formatEther(healthFactor));

//   // If it's that very large number or effectively infinite
//   if (number > 1e10) {
//     return "∞";
//   }

//   // For normal health factors, show 2 decimal places
//   return number.toFixed(2);
// };

// const getHealthFactorColor = (healthFactor) => {
//   const number = Number(formatEther(healthFactor || "0"));

//   if (number > 1e10) return "text-green-600"; // Infinite
//   if (number >= 2) return "text-green-600"; // Very safe
//   if (number >= 1.5) return "text-blue-600"; // Safe
//   if (number >= 1.1) return "text-yellow-600"; // Caution
//   return "text-red-600"; // Danger
// };

// const HealthFactorDisplay = ({ healthFactor }) => {
//   const displayValue = formatHealthFactor(healthFactor);
//   const colorClass = getHealthFactorColor(healthFactor);

//   return (
//     <div className="p-4  rounded">
//       <p className="text-sm text-gray-500">Health Factor</p>
//       <p className={`text-xl font-bold ${colorClass}`}>{displayValue}</p>
//       <p className="text-xs mt-1">
//         {displayValue === "∞"
//           ? "No borrowed assets"
//           : displayValue >= 1.5
//           ? "Position is safe"
//           : displayValue >= 1.1
//           ? "Monitor closely"
//           : "Liquidation risk!"}
//       </p>
//     </div>
//   );
// };

// // sepolia
// const POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
// const WETH_GATEWAY = "0x387d311e47e80b498169e6fb51d3193167d89F7D";
// const WBTC_ADDRESS = "0x29f2D40B0605204364af54EC677bD022dA425d03";

// const WETH_GATEWAY_ABI = [
//   {
//     inputs: [
//       { internalType: "address", name: "lendingPool", type: "address" },
//       { internalType: "address", name: "onBehalfOf", type: "address" },
//       { internalType: "uint16", name: "referralCode", type: "uint16" },
//     ],
//     name: "depositETH",
//     outputs: [],
//     stateMutability: "payable",
//     type: "function",
//   },
// ];

// const POOL_ABI = [
//   {
//     inputs: [
//       { internalType: "address", name: "asset", type: "address" },
//       { internalType: "uint256", name: "amount", type: "uint256" },
//       { internalType: "uint256", name: "interestRateMode", type: "uint256" },
//       { internalType: "uint16", name: "referralCode", type: "uint16" },
//       { internalType: "address", name: "onBehalfOf", type: "address" },
//     ],
//     name: "borrow",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
// ];

// const AaveYieldFarming = () => {
//   const { address } = useAccount();
//   const [depositAmount, setDepositAmount] = useState("");
//   const [borrowAmount, setBorrowAmount] = useState("");

//   // Get ETH balance
//   const { data: ethBalance } = useBalance({
//     address: address,
//   });

//   // Get user's Aave account data
//   const { data: accountData } = useReadContract({
//     address: POOL_ADDRESS,
//     abi: [
//       {
//         inputs: [{ internalType: "address", name: "user", type: "address" }],
//         name: "getUserAccountData",
//         outputs: [
//           {
//             internalType: "uint256",
//             name: "totalCollateralBase",
//             type: "uint256",
//           },
//           { internalType: "uint256", name: "totalDebtBase", type: "uint256" },
//           {
//             internalType: "uint256",
//             name: "availableBorrowsBase",
//             type: "uint256",
//           },
//           {
//             internalType: "uint256",
//             name: "currentLiquidationThreshold",
//             type: "uint256",
//           },
//           { internalType: "uint256", name: "ltv", type: "uint256" },
//           { internalType: "uint256", name: "healthFactor", type: "uint256" },
//         ],
//         stateMutability: "view",
//         type: "function",
//       },
//     ],
//     functionName: "getUserAccountData",
//     args: [address as `0x${string}`],
//     query: {
//       enabled: Boolean(address),
//     },
//   });

//   const { data: hash, error, isPending, writeContract } = useWriteContract();

//   const {
//     data: borrowHash,
//     error: borrowError,
//     isPending: isBorrowPending,
//     writeContract: writeBorrow,
//   } = useWriteContract();

//   const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({
//       hash,
//     });

//   const { isLoading: isBorrowConfirming, isSuccess: isBorrowConfirmed } =
//     useWaitForTransactionReceipt({
//       hash: borrowHash,
//     });

//   const handleDeposit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!depositAmount || !address) return;

//     writeContract({
//       address: WETH_GATEWAY,
//       abi: WETH_GATEWAY_ABI,
//       functionName: "depositETH",
//       args: [POOL_ADDRESS, address, 0],
//       value: parseEther(depositAmount),
//     });
//   };

//   const handleBorrow = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!borrowAmount || !address) return;

//     writeBorrow({
//       address: POOL_ADDRESS,
//       abi: POOL_ABI,
//       functionName: "borrow",
//       args: [
//         WBTC_ADDRESS,
//         parseUnits(borrowAmount, 8), // WBTC has 8 decimals
//         2, // Variable interest rate mode
//         0, // referral code
//         address,
//       ],
//     });
//   };

//   return (
//     <div className=" mx-auto p-4 space-y-6 flex items-start">
//       <Card className="max-w-[500px]">
//         <Heading>ETH → WBTC Yield Strategy</Heading>
//         <Separator className="w-full" />
//         {/* Account Overview */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="p-4  rounded">
//             <p className="text-sm text-gray-500">ETH Balance</p>
//             <p className="text-xl font-bold">
//               {ethBalance ? formatEther(ethBalance.value) : "0"} ETH
//             </p>
//           </div>
//           <HealthFactorDisplay healthFactor={accountData?.[5]} />
//         </div>

//         {/* Deposit Section */}
//         <div className="space-y-6">
//           <div>
//             <h3 className="text-lg font-medium mb-2">
//               1. Deposit ETH as Collateral
//             </h3>
//             <div className="flex gap-2">
//               <TextField.Root
//                 type="number"
//                 placeholder="Amount in ETH"
//                 value={depositAmount}
//                 onChange={(e) => setDepositAmount(e.target.value)}
//               />
//               <Button
//                 onClick={handleDeposit}
//                 disabled={isPending}
//                 className="w-32">
//                 {isConfirmed ? <Spinner /> : "Deposit"}
//               </Button>
//             </div>
//           </div>

//           {/* Borrow Section */}
//           <div>
//             <h3 className="text-lg font-medium mb-2">2. Borrow WBTC</h3>
//             <div className="flex gap-2">
//               <TextField.Root
//                 type="number"
//                 placeholder="Amount in WBTC"
//                 value={borrowAmount}
//                 onChange={(e) => setBorrowAmount(e.target.value)}
//               />
//               <Button
//                 onClick={handleBorrow}
//                 disabled={isBorrowConfirming}
//                 className="w-32">
//                 {isBorrowConfirmed ? <Spinner /> : "Borrow"}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Strategy Guide */}
//         <Callout.Root className="mt-6">
//           <Callout.Icon className="h-4 w-4">
//             <ExclamationTriangleIcon />
//           </Callout.Icon>
//           <Callout.Text className="text-white">
//             Quick Strategy Guide: Deposit ETH as collateral to enable borrowing
//             Borrow WBTC against your ETH collateral Keep health factor above 1.0
//             to avoid liquidation When WBTC price increases relative to ETH,
//             repay loan for profit ⚠️ Always maintain a safe health factor to
//             avoid liquidation
//           </Callout.Text>
//         </Callout.Root>
//       </Card>

//       <PositionManager address={address} accountData={accountData} />
//     </div>
//   );
// };

// export default AaveYieldFarming;
