"use client";
import React, { useState } from "react";
import { Text } from "@radix-ui/themes";

const CopyAddress = () => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const address = "0x44857b8f3a6fcfa1548570cf637fc8330683bf3d";

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center mt-2">
      <Text
        size="1"
        className="ml-2 cursor-pointer hover:opacity-80 transition-opacity flex items-center"
        onClick={handleCopy}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        CA: {address}
        {(isHovered || copied) && (
          <span
            className={`ml-2 text-xs ${
              copied ? "text-green-500" : "text-gray-400"
            }`}>
            {copied ? "✓ Copied!" : "(Click to copy)"}
          </span>
        )}
      </Text>
    </div>
  );
};

export default CopyAddress;
