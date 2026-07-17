import React from "react";

export function SupplierBadge({ supplier, contact }: { supplier: string; contact?: string }) {
  const initial = supplier.trim().charAt(0).toUpperCase() || "S";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-bold text-primary">
        {initial}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-white">{supplier}</p>
        {contact && <p className="truncate text-[11px] font-medium text-[#64748b]">{contact}</p>}
      </div>
    </div>
  );
}

export default SupplierBadge;
