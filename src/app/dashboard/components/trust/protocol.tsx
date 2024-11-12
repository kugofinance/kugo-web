import React from "react";
import { Box, Card, Flex, Text, Link, Button } from "@radix-ui/themes";
import { Dialog } from "@radix-ui/react-dialog";

// Protocol verification card
export const ProtocolVerification = () => (
  <Card style={{ marginBottom: "24px" }}>
    <Flex align="center" gap="4">
      <img
        src="/aave-logo.svg"
        alt="Aave Protocol"
        style={{ width: "32px", height: "32px" }}
      />
      <Box>
        <Text weight="bold">Interacting with Aave Protocol V3</Text>
        <Text size="2" color="gray">
          This interface facilitates interactions with the official Aave
          Protocol
        </Text>
      </Box>
    </Flex>
    <Flex gap="3" mt="3">
      <Link
        href="https://docs.aave.com/developers/getting-started/contracts"
        target="_blank"
        size="2">
        Verify Contracts
      </Link>
      <Link href="https://app.aave.com" target="_blank" size="2">
        Official Aave App
      </Link>
    </Flex>
  </Card>
);
