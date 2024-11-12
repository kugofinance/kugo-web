import { PriceBanner } from "./priceBanner";
import { Title } from "./title";
import { Login } from "./wallet/login";
import { TabNav, Text } from "@radix-ui/themes";
export const Header = () => (
  <div className="w-full flex h-20 justify-between items-start">
    <div>
      <Title />
      <Text size="1" className="ml-2">
        CA: 0x44857b8F3A6fcfa1548570cF637Fc8330683Bf3d
      </Text>
    </div>
    <PriceBanner />
    <div className="flex flex-col justify-end">
      <Login />

      <TabNav.Root>
        <TabNav.Link href="https://www.dextools.io/app/en/ether/pair-explorer/">
          Dextools
        </TabNav.Link>
        <TabNav.Link href="https://etherscan.io/token/0x44857b8f3a6fcfa1548570cf637fc8330683bf3d">
          Etherscan
        </TabNav.Link>
        <TabNav.Link href="https://www.x.com/KIROKUGO">X</TabNav.Link>
        <TabNav.Link href="https://www.t.me/kirokugo">Telegram</TabNav.Link>
        <TabNav.Link href="https://www.kugo.gitbook.io/kugo">
          Gitbook
        </TabNav.Link>
        <TabNav.Link href="https://www.medium.com/@kirokugo">
          Medium
        </TabNav.Link>
      </TabNav.Root>
    </div>
  </div>
);
