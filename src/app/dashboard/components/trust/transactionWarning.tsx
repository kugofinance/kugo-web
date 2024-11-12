import { Box, Text } from "@radix-ui/themes";

const TransactionWarning = () => (
  <Box
    style={{
      backgroundColor: "var(--accent-a2)",
      padding: "12px",
      Radius: "4px",
      marginTop: "16px",
    }}>
    <Text size="2" weight="bold">
      Verify Protocol Interaction:
    </Text>
    <Text size="2" as="p" style={{ marginTop: "4px" }}>
      You are interacting directly with the Aave Protocol. Always verify:
    </Text>
    <Box>
      <ul
        style={{
          listStyle: "disc",
          paddingLeft: "20px",
          marginTop: "4px",
          fontSize: "14px",
        }}>
        <li>Contract address matches Aave's official contracts</li>
        <li>Transaction parameters (amount, interest rate)</li>
        <li>Current health factor and liquidation risks</li>
      </ul>
    </Box>
  </Box>
);
