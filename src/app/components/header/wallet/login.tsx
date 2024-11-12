import ClientOnly from "./clientOnly";
import { ConnectWallet } from "./connectWallet";
export const Login = () => {
  return (
    <ClientOnly>
      <ConnectWallet />
    </ClientOnly>
  );
};
