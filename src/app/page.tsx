"use client";
import { Card, Flex } from "@radix-ui/themes";
import { ZeroXSwap } from "./components/swap/swap";
import { PriceDisplay } from "./components/tokenPrice/priceDisplay";
import { useAuth } from "./contexts/authContext";
import { YieldFarming } from "./dashboard/components/yieldFarming";
import { YieldSimulator } from "./dashboard/components/simulator/yieldSimulator";
import Image from "next/image";
import { TokenMetricsGrid } from "./components/tokenInfo/metricsGrid";
import { Footer } from "./components/footer/footer";
import StatusCallouts from "./components/login/statusCallouts";

export default function Home() {
  // const [chartData, setChartData] = useState([]);
  // const infuraUrl =
  //   "https://mainnet.infura.io/v3/14595d4e2ad0455a921b27186be75241";
  // const pairAddress = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc"; // USDC/ETH
  // useEffect(() => {
  //   const tracker = new TokenPriceTracker(infuraUrl, pairAddress, 5);

  //   async function fetchData() {
  //     const data = await tracker.getOHLCVData(4);
  //     setChartData(data);
  //   }

  //   fetchData();
  // }, []);

  const {
    isConnected,
    hasAccess,
    isLoading,
    error,
    tokenBalance,
    isInitialized,
  } = useAuth();

  return (
    <div className="w-full flex flex-col overflow-hidden">
      {/* Card with conditional content */}
      <Card className="w-full absolute bg-opacity-50 bg-black">
        <Flex>
          {!isInitialized ||
          !isConnected ||
          !hasAccess ||
          isLoading ||
          error ? (
            <StatusCallouts
              isInitialized={isInitialized}
              isConnected={isConnected}
              isLoading={isLoading}
              hasAccess={hasAccess}
              error={error}
              tokenBalance={tokenBalance}
            />
          ) : (
            // Your main content when everything is ready
            <div className="">
              <div className="bg-opacity-90 bg-black h-screen w-screen absolute -z-10 pointer-events-none"></div>
              <main className={"flex w-full justify-center items-end"}>
                <div className="w-full justify-center items-start flex gap-2">
                  <div>
                    <YieldFarming />
                    <Flex gap={"2"} mt={"1"} className="justify-end">
                      <ZeroXSwap />
                      <TokenMetricsGrid />
                      <PriceDisplay />
                    </Flex>
                  </div>
                  <div>
                    <YieldSimulator />
                    <Flex className="w-full justify-end mr-4 mt-2">
                      <Image
                        src="/images/kugofi logo.png"
                        width={200}
                        height={100}
                        alt="logo"
                      />
                    </Flex>
                  </div>
                </div>
              </main>
            </div>
          )}
        </Flex>
      </Card>

      {/* Video that's always present */}
      <video
        src="/media/video.mp4"
        className="w-full h-full -z-10"
        autoPlay
        muted
        loop // Added loop if you want it to keep playing
        playsInline // Better mobile experience
      />
    </div>
  );
}
