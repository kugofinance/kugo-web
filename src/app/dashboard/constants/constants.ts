export const ABIS = {
  WETH_GATEWAY: [
    {
      inputs: [
        { internalType: "address", name: "lendingPool", type: "address" },
        { internalType: "address", name: "onBehalfOf", type: "address" },
        { internalType: "uint16", name: "referralCode", type: "uint16" },
      ],
      name: "depositETH",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "pool", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
        { internalType: "address", name: "to", type: "address" },
      ],
      name: "withdrawETH",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],

  POOL: [
    {
      inputs: [
        { internalType: "address", name: "asset", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
        { internalType: "uint256", name: "interestRateMode", type: "uint256" },
        { internalType: "uint16", name: "referralCode", type: "uint16" },
        { internalType: "address", name: "onBehalfOf", type: "address" },
      ],
      name: "borrow",
      outputs: [],
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
  ],

  POOL_DATA_PROVIDER: [
    {
      inputs: [{ internalType: "address", name: "asset", type: "address" }],
      name: "getReserveData",
      outputs: [
        { internalType: "uint256", name: "liquidityRate", type: "uint256" },
        {
          internalType: "uint256",
          name: "variableBorrowRate",
          type: "uint256",
        },
        { internalType: "uint256", name: "stableBorrowRate", type: "uint256" },
        { internalType: "uint40", name: "lastUpdateTimestamp", type: "uint40" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],

  CHAINLINK_FEED: [
    {
      inputs: [],
      name: "latestRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
};
export const ADDRESSES = {
  // Sepolia addresses
  SEPOLIA: {
    POOL: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
    WETH_GATEWAY: "0x387d311e47e80b498169e6fb51d3193167d89F7D",
    WBTC: "0x29f2D40B0605204364af54EC677bD022dA425d03",
    AWETH: "0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830",
    POOL_DATA_PROVIDER: "0x927F584d4321C1dCcBf5e2902368124b02419a1E",
  },
  PRICE_FEEDS: {
    ETH_USD: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH/USD
    BTC_USD: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c", // BTC/USD
  },
};
