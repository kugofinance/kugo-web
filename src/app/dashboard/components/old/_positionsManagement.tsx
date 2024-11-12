// import {
//   Button,
//   Card,
//   Dialog,
//   Heading,
//   Spinner,
//   TextField,
// } from "@radix-ui/themes";
// import React, { useState } from "react";
// import { formatEther, formatUnits, parseUnits } from "viem";
// import {
//   useReadContracts,
//   useWaitForTransactionReceipt,
//   useWriteContract,
// } from "wagmi";
// import { formatHealthFactor } from "../_yieldFarming";
// import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
// import RepaymentDialog from "../positions/repayment";

// // sepolia
// const POOL_DATA_PROVIDER = "0x927F584d4321C1dCcBf5e2902368124b02419a1E";
// const POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
// const WETH_GATEWAY = "0x387d311e47e80b498169e6fb51d3193167d89F7D";
// const WBTC_ADDRESS = "0x29f2D40B0605204364af54EC677bD022dA425d03";

// const POOL_ABI = [
//   {
//     inputs: [
//       { internalType: "address", name: "asset", type: "address" },
//       { internalType: "uint256", name: "amount", type: "uint256" },
//       { internalType: "uint256", name: "rateMode", type: "uint256" },
//       { internalType: "address", name: "onBehalfOf", type: "address" },
//     ],
//     name: "repay",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "asset", type: "address" }],
//     name: "approve",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
// ];

// const PositionManager = ({ address, accountData }) => {
//   // Get multiple reserve data in a single call
//   const { data: positions } = useReadContracts({
//     contracts: [
//       {
//         address: POOL_DATA_PROVIDER,
//         abi: [
//           {
//             inputs: [
//               { internalType: "address", name: "asset", type: "address" },
//             ],
//             name: "getReserveData",
//             outputs: [
//               {
//                 internalType: "uint256",
//                 name: "liquidityRate",
//                 type: "uint256",
//               },
//               {
//                 internalType: "uint256",
//                 name: "variableBorrowRate",
//                 type: "uint256",
//               },
//               {
//                 internalType: "uint256",
//                 name: "stableBorrowRate",
//                 type: "uint256",
//               },
//               {
//                 internalType: "uint40",
//                 name: "lastUpdateTimestamp",
//                 type: "uint40",
//               },
//             ],
//             stateMutability: "view",
//             type: "function",
//           },
//         ],
//         functionName: "getReserveData",
//         args: [WBTC_ADDRESS],
//       },
//       {
//         address: POOL_ADDRESS,
//         abi: [
//           {
//             inputs: [
//               { internalType: "address", name: "user", type: "address" },
//             ],
//             name: "getUserConfiguration",
//             outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//             stateMutability: "view",
//             type: "function",
//           },
//         ],
//         functionName: "getUserConfiguration",
//         args: [address],
//       },
//     ],
//     query: {
//       enabled: Boolean(address),
//     },
//   });

//   const [reserveData, userConfig] = positions || [];

//   const formatAPY = (rate) => {
//     if (!rate) return "0";
//     // Convert ray (27 decimals) to percentage
//     return (Number(formatUnits(rate, 27)) * 100).toFixed(2);
//   };

//   return (
//     <Card className="mt-6">
//       <Heading className="text-xl font-bold">Your Position</Heading>
//       <div>
//         <div className="grid grid-cols-2 gap-4">
//           {/* Supplied Assets */}
//           <div className="p-4  rounded-lg">
//             <h3 className="text-sm text-gray-500 mb-3">Supplied Assets</h3>
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <img src="/eth-logo.png" alt="ETH" className="w-6 h-6" />
//                   <span className="font-medium">ETH</span>
//                 </div>
//                 <div className="text-sm text-gray-500 mt-1">
//                   APY: {formatAPY(reserveData?.liquidityRate)}%
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="font-medium">
//                   {accountData ? formatEther(accountData[0]) : "0"} ETH
//                 </div>
//                 <div className="text-sm text-green-600">
//                   <ArrowUpIcon className="inline h-3 w-3 mr-1" />
//                   Earning
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Borrowed Assets */}
//           <div className="p-4  rounded-lg">
//             <h3 className="text-sm text-gray-500 mb-3">Borrowed Assets</h3>
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <img src="/btc-logo.png" alt="WBTC" className="w-6 h-6" />
//                   <span className="font-medium">WBTC</span>
//                 </div>
//                 <div className="text-sm text-gray-500 mt-1">
//                   APR: {formatAPY(reserveData?.variableBorrowRate)}%
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="font-medium">
//                   {accountData ? formatUnits(accountData[1], 8) : "0"} WBTC
//                 </div>
//                 <div className="text-sm text-yellow-600">
//                   <ArrowDownIcon className="inline h-3 w-3 mr-1" />
//                   Borrowing
//                 </div>
//               </div>
//             </div>

//             {/* Repayment Actions */}
//             <div className="mt-4 flex gap-2">
//               <RepaymentDialog
//                 address={address}
//                 currentDebt={accountData ? formatUnits(accountData[1], 8) : "0"}
//                 onRepay={() => {
//                   // Refresh position data after repayment
//                   // This will happen automatically if you're using useReadContract with watch: true
//                 }}
//               />
//               <Button
//                 variant="outline"
//                 size="1"
//                 className="w-full"
//                 onClick={() => {
//                   /* Add borrow more handler */
//                 }}>
//                 Borrow More
//               </Button>
//             </div>
//           </div>

//           {/* Position Stats */}
//           <div className="col-span-2 grid grid-cols-3 gap-4 mt-2">
//             <div className="p-3  rounded-lg">
//               <div className="text-sm text-gray-500">Collateral Value</div>
//               <div className="text-lg font-medium">
//                 $
//                 {accountData
//                   ? (Number(formatEther(accountData[0])) * 1890).toFixed(2)
//                   : "0"}
//               </div>
//             </div>
//             <div className="p-3  rounded-lg">
//               <div className="text-sm text-gray-500">Borrowed Value</div>
//               <div className="text-lg font-medium">
//                 $
//                 {accountData
//                   ? (Number(formatUnits(accountData[1], 8)) * 43000).toFixed(2)
//                   : "0"}
//               </div>
//             </div>
//             <div className="p-3  rounded-lg">
//               <div className="text-sm text-gray-500">Available to Borrow</div>
//               <div className="text-lg font-medium">
//                 $
//                 {accountData
//                   ? (Number(formatEther(accountData[2])) * 1890).toFixed(2)
//                   : "0"}
//               </div>
//             </div>
//           </div>

//           {/* Risk Metrics */}
//           <div className="col-span-2 p-4  rounded-lg mt-2 bg-gray-50">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h4 className="font-medium">Position Health</h4>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Liquidation at &lt; 1.0 health factor
//                 </p>
//               </div>
//               <div className="text-right">
//                 <div
//                   className={`text-lg font-bold ${
//                     Number(formatHealthFactor(accountData?.[5])) >= 1.5
//                       ? "text-green-600"
//                       : Number(formatHealthFactor(accountData?.[5])) >= 1.1
//                       ? "text-yellow-600"
//                       : "text-red-600"
//                   }`}>
//                   {accountData ? formatHealthFactor(accountData[5]) : "∞"}
//                 </div>
//                 <div className="text-sm text-gray-500">Health Factor</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };
// export default PositionManager;
