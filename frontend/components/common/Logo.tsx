"use client";

import React from "react";
import { Boxes } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3b82f6] to-[#14b8a6] text-white shadow-md shadow-blue-500/20">
        <Boxes className="size-5.5" />
      </div>
      {showText && (
        <span className="bg-gradient-to-r from-white to-[#94a3b8] bg-clip-text text-lg font-bold tracking-tight text-transparent">
          Inventory<span className="text-[#3b82f6]">AI</span>
        </span>
      )}
    </div>
  );
}
export default Logo;
