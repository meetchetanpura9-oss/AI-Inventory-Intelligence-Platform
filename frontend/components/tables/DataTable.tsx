"use client";

import React, { type ReactNode } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyState?: ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyState,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <div className="mt-4">{emptyState}</div>;
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#223046] bg-[#102235]">
      <table className="w-full border-collapse text-left text-sm text-white">
        <thead className="border-b border-[#223046] bg-[#07111f]/50 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`px-6 py-4 font-semibold ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#223046] bg-[#102235]/30">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="transition-colors hover:bg-[#102235]/65">
              {columns.map((col, idx) => {
                const cellContent =
                  typeof col.accessor === "function"
                    ? col.accessor(item)
                    : (item[col.accessor] as ReactNode);

                return (
                  <td key={idx} className={`whitespace-nowrap px-6 py-4 text-[#94a3b8] ${col.className || ""}`}>
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default DataTable;
