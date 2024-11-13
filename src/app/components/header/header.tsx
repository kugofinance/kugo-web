import CopyAddress from "./copyAddress";
import { PriceBanner } from "./priceBanner";
import { Title } from "./title";
import { Login } from "./wallet/login";
import { TabNav, Text } from "@radix-ui/themes";
export const Header = () => (
  <div className="w-full flex h-20 justify-between items-start">
    <div>
      <Title />
      <CopyAddress />
    </div>
    <PriceBanner />
    <div className="flex flex-col justify-end">
      <Login />

      <TabNav.Root>
        <TabNav.Link href="https://www.dextools.io/app/en/ether/pair-explorer/0x3f36074214a47e9ead86498cd867053875264d47?t=1731478287699">
          Dextools
        </TabNav.Link>
        <TabNav.Link href="https://etherscan.io/token/0x44857b8f3a6fcfa1548570cf637fc8330683bf3d">
          Etherscan
        </TabNav.Link>
        <TabNav.Link href="https://www.x.com/KIROKUGO">X</TabNav.Link>
        <TabNav.Link href="https://www.t.me/kirokugo">Telegram</TabNav.Link>
        <TabNav.Link href="https://kugo.gitbook.io/kugo">Gitbook</TabNav.Link>
        <TabNav.Link href="https://www.medium.com/@kirokugo">
          Medium
        </TabNav.Link>
      </TabNav.Root>
    </div>
  </div>
);
