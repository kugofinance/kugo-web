import { useEffect, useRef } from "react";
import { createChart, IChartApi, LineStyle } from "lightweight-charts";

interface PriceSparklineProps {
  data: { time: number; value: number }[];
  color?: string;
  height?: number;
}

export function PriceSparkline({
  data,
  color = "#2563eb",
  height = 50,
}: PriceSparklineProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    chartRef.current = createChart(chartContainerRef.current, {
      height: height,
      handleScale: false,
      handleScroll: false,
      rightPriceScale: {
        visible: false,
      },
      leftPriceScale: {
        visible: false,
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
      timeScale: {
        visible: false,
      },
      crosshair: {
        vertLine: {
          visible: false,
          labelVisible: false,
        },
        horzLine: {
          visible: false,
          labelVisible: false,
        },
      },
    });

    const series = chartRef.current.addLineSeries({
      color: color,
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lineStyle: LineStyle.Solid,
      priceLineVisible: false,
    });

    series.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data, color, height]);

  return <div ref={chartContainerRef} />;
}
