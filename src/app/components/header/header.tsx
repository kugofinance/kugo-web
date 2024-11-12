import { PriceBanner } from "./priceBanner";
import { Title } from "./title";
import { Login } from "./wallet/login";

export const Header = () => (
  <div className="w-full flex h-20 justify-between items-start">
    <Title />
    <PriceBanner />
    <Login />
  </div>
);
