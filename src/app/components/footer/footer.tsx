import { Link, TabNav } from "@radix-ui/themes";

export const Footer = () => {
  return (
    <div className="flex items-center gap-4 ml-4">
      <TabNav.Root>
        <TabNav.Link>Dextools</TabNav.Link>
        <TabNav.Link>Etherscan</TabNav.Link>
        <TabNav.Link>X</TabNav.Link>
        <TabNav.Link>Telegram</TabNav.Link>
        <TabNav.Link>Gitbook</TabNav.Link>
        <TabNav.Link>Medium</TabNav.Link>
      </TabNav.Root>
    </div>
  );
};
