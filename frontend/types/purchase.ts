export interface PurchaseCreate {
  product_id: number;
  quantity: number;
  cost_price: number;
  supplier_name: string;
}

export interface Purchase extends PurchaseCreate {
  id: number;
  created_at: string;
  product_name?: string;
  sku?: string;
}
