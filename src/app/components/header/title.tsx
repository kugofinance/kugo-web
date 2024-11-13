import { Heading, Text, Card, Code } from "@radix-ui/themes";

export const Title = () => {
  return (
    <Card className="flex">
      <div className="flex gap-4 items-baseline">
        <Heading size={"2"}> KUGO.FI</Heading>
        <Text size={"2"}>Decentralized Finance Ecosystem</Text>
        <Code size={"1"}>Beta Release</Code>
      </div>
    </Card>
  );
};
