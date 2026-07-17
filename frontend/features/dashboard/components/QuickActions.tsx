import {
  BarChart3,
  FileText,
  LineChart,
  PackagePlus,
  PlusCircle,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { label: "Add Product", icon: PackagePlus },
  { label: "Add Sale", icon: PlusCircle },
  { label: "Add Purchase", icon: ShoppingBag },
  { label: "Generate Report", icon: FileText },
  { label: "View Analytics", icon: BarChart3 },
  { label: "Demand Intelligence", icon: LineChart },
];

export function QuickActions() {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/15 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/25">
      <h2 className="text-base font-semibold text-white">Quick Actions</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              className="h-11 justify-start border-white/10 bg-white/[0.06] text-white shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-white/10"
              variant="outline"
            >
              <Icon className="size-4 text-cyan-200" />
              {action.label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
