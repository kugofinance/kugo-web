const SafetyInfoDialog = () => (
  <Dialog.Root>
    <Dialog.Trigger>
      <Button variant="soft" size="2">
        Verify Transaction Safety
      </Button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title>Transaction Safety</Dialog.Title>
        <Box style={{ marginTop: "16px" }}>
          <Text size="2" as="p" mb="3">
            This interface is automating interactions with the Aave Protocol:
          </Text>
          <Box as="ul" style={{ listStyle: "disc", paddingLeft: "20px" }}>
            <li>
              All transactions are directly with Aave's verified smart contracts
            </li>
            <li>We never take custody of your assets</li>
            <li>All contract interactions can be verified on Etherscan</li>
            <li>Same interest rates and terms as Aave's official interface</li>
          </Box>
          <Box mt="4">
            <Text size="2" weight="bold">
              Before each transaction:
            </Text>
            <Box
              as="ul"
              style={{
                listStyle: "disc",
                paddingLeft: "20px",
                marginTop: "8px",
              }}>
              <li>Verify the contract address in your wallet</li>
              <li>Check the transaction parameters</li>
              <li>Confirm interest rates and health factor</li>
            </Box>
          </Box>
        </Box>
        <Flex gap="3" mt="4">
          <Link href="https://docs.aave.com/risk" target="_blank" size="2">
            Aave Risk Framework
          </Link>
          <Dialog.Close>
            <Button variant="soft">Close</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
