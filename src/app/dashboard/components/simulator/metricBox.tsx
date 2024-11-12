import { Box, TextField, DataList, Text, Grid, Table } from "@radix-ui/themes";

interface MetricsGridProps {
  ethAmount: number;
  setEthAmount: (amount: number) => void;
  metrics: {
    collateralValueUSD: number;
    maxBorrowBTC: number;
    maxBorrowUSD: number;
    totalDailyYield: number;
    dailyStakingReturn: number;
    dailyBorrowingCost: number;
    potentialDailyPriceGain: number;
    annualizedAPY: number;
    annualizedYield: number;
  };
}

export const MetricsGrid = ({
  ethAmount,
  setEthAmount,
  metrics,
}: MetricsGridProps) => {
  return (
    <Box className="w-full">
      <Text as="div" size="2" mb="2" weight="bold">
        Input ETH Amount
      </Text>
      <TextField.Root
        type="number"
        value={ethAmount}
        onChange={(e) => setEthAmount(Number(e.target.value))}
        placeholder="Enter ETH amount"
        className="mb-6"
      />

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Metric</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Collateral Value</Table.Cell>
            <Table.Cell className="font-bold">
              ${metrics.collateralValueUSD.toLocaleString()}
            </Table.Cell>
            <Table.Cell className="text-gray-500">
              Your deposited ETH value
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Maximum WBTC Borrow</Table.Cell>
            <Table.Cell className="font-bold">
              {metrics.maxBorrowBTC.toFixed(4)} BTC
            </Table.Cell>
            <Table.Cell className="text-gray-500">
              ${metrics.maxBorrowUSD.toLocaleString()}
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Daily Yield</Table.Cell>
            <Table.Cell className="font-bold">
              ${metrics.totalDailyYield.toFixed(2)}
            </Table.Cell>
            <Table.Cell className="text-gray-500">
              +${metrics.dailyStakingReturn.toFixed(2)} staking, -$
              {metrics.dailyBorrowingCost.toFixed(2)} borrow, +$
              {metrics.potentialDailyPriceGain.toFixed(2)} est. gain
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Projected Annual Yield</Table.Cell>
            <Table.Cell className="font-bold text-cyan-500">
              {metrics.annualizedAPY.toFixed(2)}% APY
            </Table.Cell>
            <Table.Cell className="text-gray-500">
              ${metrics.annualizedYield.toLocaleString()} per year
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
