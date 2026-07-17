"use client";

import React, { type ChangeEvent, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({
  placeholder = "Search products, inventory, transactions...",
  value,
  onChange,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const shortcut = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K";

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-[#94a3b8]" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-full border border-border bg-background/80 pl-10 pr-20 text-sm text-foreground placeholder-[#94a3b8] outline-none transition-all duration-200 focus:border-primary focus:bg-background focus:shadow-lg focus:shadow-primary/10 focus:ring-2 focus:ring-primary/25"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-2 py-1 text-[10px] font-medium text-[#94a3b8] sm:block">
        {shortcut}
      </kbd>
    </div>
  );
}
export default SearchBar;
