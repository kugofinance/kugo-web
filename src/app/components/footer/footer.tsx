import { Link, TabNav, Text } from "@radix-ui/themes";

export const Footer = () => {
  return (
    <div className="flex items-center gap-4 ml-4">
      <TabNav.Root>
        <TabNav.Link href="https://www.dextools.io/app/en/ether/pair-explorer/">
          Dextools
        </TabNav.Link>
        <TabNav.Link href="https://etherscan.io/token/0x44857b8f3a6fcfa1548570cf637fc8330683bf3d">
          Etherscan
        </TabNav.Link>
        <TabNav.Link href="x.com/KIROKUGO">X</TabNav.Link>
        <TabNav.Link href="t.me/kirokugo">Telegram</TabNav.Link>
        <TabNav.Link href="kugo.gitbook.io/kugo">Gitbook</TabNav.Link>
        <TabNav.Link href="medium.com/@kirokugo">Medium</TabNav.Link>
      </TabNav.Root>

      <Text size="1">0x44857b8F3A6fcfa1548570cF637Fc8330683Bf3d</Text>
    </div>
  );
};
