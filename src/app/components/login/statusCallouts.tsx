import React from "react";
import { Callout, Flex, Text } from "@radix-ui/themes";
import {
  UpdateIcon,
  PersonIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

const StatusCallouts = ({
  isInitialized,
  isConnected,
  isLoading,
  hasAccess,
  error,
  tokenBalance,
}) => {
  return (
    <Flex direction="column" gap="3" className="w-full max-w-md mx-auto">
      {!isInitialized ? (
        <Callout.Root size="2" variant="surface">
          <Callout.Icon>
            <UpdateIcon className="animate-spin" />
          </Callout.Icon>
          <Text>Initializing...</Text>
        </Callout.Root>
      ) : !isConnected ? (
        <Callout.Root size="2" variant="surface" color="blue">
          <Callout.Icon>
            <PersonIcon />
          </Callout.Icon>
          <Text>Please connect your wallet to continue</Text>
        </Callout.Root>
      ) : isLoading ? (
        <Callout.Root size="2" variant="surface" color="gray">
          <Callout.Icon>
            <UpdateIcon className="animate-spin" />
          </Callout.Icon>
          <Text>Loading token balance...</Text>
        </Callout.Root>
      ) : !hasAccess ? (
        <Callout.Root size="2" variant="surface" color="orange">
          <Flex direction="column" gap="2">
            <Flex gap="2" align="center">
              <CrossCircledIcon />
              <Text weight="medium" size="4">
                Access Denied
              </Text>
            </Flex>
            {error && <Text>{error}</Text>}
            {tokenBalance !== "0" && (
              <Text>Current balance: {tokenBalance} tokens.</Text>
            )}
          </Flex>
        </Callout.Root>
      ) : null}
    </Flex>
  );
};

export default StatusCallouts;
