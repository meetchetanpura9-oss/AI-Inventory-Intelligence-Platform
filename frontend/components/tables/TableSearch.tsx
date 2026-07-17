"use client";

import React, { type ChangeEvent } from "react";
import { Search } from "lucide-react";

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TableSearch({
  value,
  onChange,
  placeholder = "Search table data...",
}: TableSearchProps) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-[#223046] bg-[#07111f] pl-9 pr-3 text-xs text-white placeholder-[#94a3b8] outline-none transition-all duration-200 focus:border-[#3b82f6]"
      />
    </div>
  );
}
export default TableSearch;
