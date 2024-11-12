import { Table, Text } from "@radix-ui/themes";

interface ComparisonTableProps {
  traditional: {
    apy: number;
    description: string;
    pros: string[];
    cons: string[];
  };
  yield: {
    apy: number;
    description: string;
    pros: string[];
    cons: string[];
  };
}

export const ComparisonTable = ({
  traditional,
  yield: yieldStrategy,
}: ComparisonTableProps) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Strategy</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            Traditional ETH Staking
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="text-cyan-500">
            ETH-BTC Yield Strategy
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>APY</Table.Cell>
          <Table.Cell>{traditional.apy.toFixed(2)}% APY</Table.Cell>
          <Table.Cell className="text-cyan-500">
            {yieldStrategy.apy.toFixed(2)}% APY
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Description</Table.Cell>
          <Table.Cell>{traditional.description}</Table.Cell>
          <Table.Cell>{yieldStrategy.description}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Pros</Table.Cell>
          <Table.Cell>{traditional.pros.join(", ")}</Table.Cell>
          <Table.Cell>{yieldStrategy.pros.join(", ")}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cons</Table.Cell>
          <Table.Cell>{traditional.cons.join(", ")}</Table.Cell>
          <Table.Cell>{yieldStrategy.cons.join(", ")}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};
