import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setInputValue(value);
    }, 0);

    return () => window.clearTimeout(handler);
  }, [value]);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      onChange(inputValue);
    }, 500);

    return () => window.clearTimeout(handler);
  }, [inputValue, onChange]);

  return (
    <div className="relative flex-1 max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="size-4.5 text-[#94a3b8]" />
      </div>
      <input
        type="search"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Search products..."
        className="h-10 w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-[#94a3b8] focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

export default ProductSearch;
