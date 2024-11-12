// import React, { useRef, useEffect } from "react";
// import {
//   createChart,
//   CrosshairMode,
//   IChartApi,
//   ChartOptions,
//   CandlestickSeriesOptions,
//   HistogramSeriesOptions,
//   Time,
// } from "lightweight-charts";

// // Interface for the OHLCV data coming from TokenPriceTracker
// interface OHLCV {
//   timestamp: number;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume: number;
// }

// // Interfaces for the formatted data expected by lightweight-charts
// interface PriceData {
//   time: Time;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
// }

// interface VolumeData {
//   time: Time;
//   value: number;
//   color: string;
// }

// interface PriceChartProps {
//   ohlcvData: OHLCV[];
//   height?: number;
// }

// // Data transformer to convert OHLCV data to the format expected by lightweight-charts
// const formatChartData = (
//   ohlcvData: OHLCV[]
// ): { priceData: PriceData[]; volumeData: VolumeData[] } => {
//   const priceData = ohlcvData.map((candle) => ({
//     time: candle.timestamp as Time,
//     open: candle.open,
//     high: candle.high,
//     low: candle.low,
//     close: candle.close,
//   }));

//   const volumeData = ohlcvData.map((candle) => ({
//     time: candle.timestamp as Time,
//     value: candle.volume,
//     color: candle.close >= candle.open ? "#5feac7" : "#dc9c36",
//   }));

//   return { priceData, volumeData };
// };

// const PriceChart: React.FC<PriceChartProps> = ({ ohlcvData, height = 384 }) => {
//   const chartContainerRef = useRef<HTMLDivElement | null>(null);
//   const chart = useRef<IChartApi | null>(null);

//   const handleResize = () => {
//     if (chart.current && chartContainerRef.current) {
//       const width = chartContainerRef.current.clientWidth;
//       chart.current.resize(width, height);
//     }
//   };

//   useEffect(() => {
//     if (!chartContainerRef?.current) return;

//     const { priceData, volumeData } = formatChartData(ohlcvData);
//     const parentContainer = chartContainerRef.current.parentElement;

//     if (parentContainer) {
//       const width = parentContainer.clientWidth;

//       const chartOptions: ChartOptions = {
//         width: width,
//         height: height,
//         layout: {
//           textColor: "#e8c63e",
//           fontSize: 10,
//           fontFamily: "Helvetica",
//         },
//         grid: {
//           vertLines: { color: "#4A615E" },
//           horzLines: { color: "#4A615E" },
//         },
//         crosshair: {
//           mode: CrosshairMode.Normal,
//         },
//         timeScale: {
//           Color: "#485c7b",
//         },
//       };

//       chart.current = createChart(chartContainerRef.current, chartOptions);

//       const candleSeriesOptions: CandlestickSeriesOptions = {
//         priceFormat: { type: "price" },
//         priceLineWidth: 1,
//         upColor: "#5feac7",
//         UpColor: "#000",
//         downColor: "#dc9c36",
//         DownColor: "#000",
//         wickDownColor: "#838ca1",
//         wickUpColor: "#838ca1",
//       };

//       const candleSeries =
//         chart.current.addCandlestickSeries(candleSeriesOptions);
//       candleSeries.setData(priceData);

//       const volumeSeriesOptions: HistogramSeriesOptions = {
//         color: "#1dd1bc",
//         priceScaleId: "right",
//         priceFormat: { type: "volume" },
//       };

//       const volumeSeries =
//         chart.current.addHistogramSeries(volumeSeriesOptions);
//       volumeSeries.setData(volumeData);

//       // ResizeObserver is a web API, so we don't need to import it
//       const resizeObserver = new ResizeObserver(handleResize);
//       resizeObserver.observe(chartContainerRef.current);

//       return () => {
//         chart.current?.remove();
//         resizeObserver.disconnect();
//       };
//     }
//   }, [ohlcvData, height]);

//   return (
//     <div
//       ref={chartContainerRef}
//       className="chart-container"
//       style={{ width: "100%", height: `${height}px` }}
//     />
//   );
// };

// export default PriceChart;
