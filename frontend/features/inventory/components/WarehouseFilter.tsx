import React from "react";

interface WarehouseFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function WarehouseFilter({ value, onChange }: WarehouseFilterProps) {
  const warehouses = ["All", "Warehouse A", "Warehouse B", "Warehouse C"];

  return (
    <div className="flex flex-col gap-1 select-none">
      <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
        Warehouse Location
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
      >
        {warehouses.map((w) => (
          <option key={w} value={w}>
            {w === "All" ? "All Warehouses" : w}
          </option>
        ))}
      </select>
    </div>
  );
}

export default WarehouseFilter;
