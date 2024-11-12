const ContractVerification = () => (
  <Card style={{ marginBottom: "16px", padding: "12px" }}>
    <Flex direction="column" gap="2">
      <Text size="2" color="gray">
        Contract Addresses (Sepolia)
      </Text>
      <Flex justify="between" align="center">
        <Text size="2">Pool</Text>
        <Link
          href={`https://sepolia.etherscan.io/address/${POOL_ADDRESS}`}
          target="_blank"
          size="2">
          {POOL_ADDRESS.slice(0, 6)}...{POOL_ADDRESS.slice(-4)}
        </Link>
      </Flex>
      <Flex justify="between" align="center">
        <Text size="2">WETH Gateway</Text>
        <Link
          href={`https://sepolia.etherscan.io/address/${WETH_GATEWAY}`}
          target="_blank"
          size="2">
          {WETH_GATEWAY.slice(0, 6)}...{WETH_GATEWAY.slice(-4)}
        </Link>
      </Flex>
    </Flex>
  </Card>
);
