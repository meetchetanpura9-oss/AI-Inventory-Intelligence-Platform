import type { AIDatasetRow } from "../types";

const columns = [
  "date",
  "product",
  "category",
  "warehouse",
  "stock",
  "sales",
  "purchase",
  "search_count",
  "failed_searches",
  "moving_avg_7",
  "moving_avg_30",
  "festival",
  "weather_score",
] as const;

const labels: Record<(typeof columns)[number], string> = {
  date: "Date",
  product: "Product",
  category: "Category",
  warehouse: "Warehouse",
  stock: "Stock",
  sales: "Sales",
  purchase: "Purchase",
  search_count: "Searches",
  failed_searches: "Failed",
  moving_avg_7: "7D Avg",
  moving_avg_30: "30D Avg",
  festival: "Festival",
  weather_score: "Weather",
};

export function AIDatasetTable({ rows }: { rows: AIDatasetRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-border bg-black/20 text-[10px] uppercase tracking-wider text-[#94a3b8]">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-bold">{labels[column]}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={`${row.date}-${row.product}-${row.warehouse}`} className="text-[#dbeafe]">
                {columns.map((column) => (
                  <td key={column} className="whitespace-nowrap px-4 py-3">
                    {typeof row[column] === "boolean" ? (row[column] ? "Yes" : "No") : row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
