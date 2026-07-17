import React from "react";
import { Badge } from "@/components/ui/badge";

interface ProductStatusProps {
  status: "Safe" | "Warning" | "Critical";
  stock: number;
}

export function ProductStatus({ status, stock }: ProductStatusProps) {
  let text = "In Stock";
  let variant: "default" | "secondary" | "destructive" = "default";

  if (status === "Critical") {
    text = "Out of Stock";
    variant = "destructive";
  } else if (status === "Warning") {
    text = `Low Stock (${stock})`;
    variant = "secondary";
  } else {
    text = `In Stock (${stock})`;
  }

  return (
    <Badge variant={variant} className="capitalize font-semibold text-xs py-0.5 px-2 rounded-full">
      {text}
    </Badge>
  );
}
export default ProductStatus;
