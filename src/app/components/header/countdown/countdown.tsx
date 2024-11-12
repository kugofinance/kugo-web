"use client";
import { useState, useEffect } from "react";
import { Flex, Text } from "@radix-ui/themes";

const CountdownTimer = () => {
  const [countdown, setCountdown] = useState(15);

  // SVG circle properties
  const size = 20;
  const strokeWidth = 7;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((15 - countdown) / 15) * circumference;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex gap-1 items-start">
      <Flex gap={"1"}>
        <Text className="w-50 min-w-50" size={"1"} weight={"light"}>
          Refresh in {countdown}s
        </Text>
        <div className="w-5">
          <svg
            width={size}
            height={size}
            className="transform -rotate-90 scale-75">
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#141110"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#D4B3A5"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
        </div>
      </Flex>
    </div>
  );
};

export default CountdownTimer;
