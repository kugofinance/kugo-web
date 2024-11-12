"use client";
import { YieldFarming } from "./components/yieldFarming";
import { YieldSimulator } from "./components/simulator/yieldSimulator";
import Image from "next/image";
import { Card, Flex } from "@radix-ui/themes";
import { ZeroXSwap } from "../components/swap/swap";
import { PriceDisplay } from "../components/tokenPrice/priceDisplay";

export default function Dashboard() {
  return (
    <div className="w-full justify-center items-start flex">
      <div>
        <YieldFarming />
        <Card>
          <Flex gap={"5"}>
            <ZeroXSwap />
            <PriceDisplay />
          </Flex>
        </Card>
      </div>
      <YieldSimulator />
      {/* <Image
        src="/images/kugofi logo.png"
        width={400}
        height={200}
        alt="logo"
        className="absolute bottom-20 left-5"
      /> */}
    </div>
  );
}
