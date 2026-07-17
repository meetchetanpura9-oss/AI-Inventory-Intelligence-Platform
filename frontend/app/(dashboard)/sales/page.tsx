"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, RefreshCw, ShoppingCart, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/auth-store";
import { ROLES, type Role } from "@/constants/roles";
import { getProducts } from "@/services/product";
import { getFriendlyErrorMessage } from "@/utils/api-error";
import { useSales } from "@/features/sales/hooks/useSales";
import { salesService } from "@/features/sales/services/salesService";
import { SalesSummaryCards } from "@/features/sales/components/SalesSummaryCards";
import { SalesToolbar } from "@/features/sales/components/SalesToolbar";
import { SalesTable } from "@/features/sales/components/SalesTable";
import { SalesDrawer } from "@/features/sales/components/SalesDrawer";
import { ExportSalesDialog } from "@/features/sales/components/ExportSalesDialog";
import { EmptyState } from "@/features/sales/components/EmptyState";
import { LoadingSkeleton } from "@/features/sales/components/LoadingSkeleton";
import type { DateRangeFilter, OrderStatus, PaymentStatus } from "@/features/sales/types";

interface CreateSaleFormData {
  productId: string;
  quantity: number;
  sellingPrice: number;
  customerName: string;
}

const SALES_CREATE_ROLES: Role[] = [ROLES.ADMIN, ROLES.MANAGER, ROLES.STORE_MANAGER, ROLES.STAFF];

export default function SalesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const canCreate = Boolean(user && SALES_CREATE_ROLES.includes(user.role));

  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<"All" | OrderStatus>("All");
  const [paymentStatus, setPaymentStatus] = useState<"All" | PaymentStatus>("All");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("30 Days");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSaleFormData>({
    productId: "",
    quantity: 1,
    sellingPrice: 0,
    customerName: "",
  });

  const filters = useMemo(
    () => ({
      search,
      orderStatus,
      paymentStatus,
      dateRange,
      customFrom,
      customTo,
      page: currentPage,
      limit: itemsPerPage,
    }),
    [search, orderStatus, paymentStatus, dateRange, customFrom, customTo, currentPage, itemsPerPage]
  );

  const { data, isLoading, isError, refetch } = useSales(filters);
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const sales = data?.items ?? [];
  const exportRows = data?.exportRows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const createMutation = useMutation({
    mutationFn: (newSale: CreateSaleFormData) =>
      salesService.createSale({
        product_id: Number(newSale.productId),
        quantity: newSale.quantity,
        selling_price: newSale.sellingPrice,
        customer_name: newSale.customerName,
      }),
    onSuccess: () => {
      toast.success("Sales order created");
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error(getFriendlyErrorMessage(error));
    },
  });

  const resetPage = () => setCurrentPage(1);

  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find((product) => String(product.id) === productId);
    setFormData((current) => ({
      ...current,
      productId,
      sellingPrice: selectedProduct ? selectedProduct.selling_price : 0,
    }));
  };

  const handleOpenCreate = () => {
    if (!canCreate) return;

    if (products.length === 0) {
      toast.error("No products available in catalog. Please define a product first.");
      return;
    }

    const defaultProduct = products[0];
    setFormData({
      productId: String(defaultProduct.id),
      quantity: 1,
      sellingPrice: defaultProduct.selling_price,
      customerName: "",
    });
    setIsCreateOpen(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.productId || !formData.customerName.trim() || formData.quantity <= 0) {
      toast.error("Please fill in customer name, product, and quantity.");
      return;
    }

    createMutation.mutate(formData);
  };

  const handleView = (id: number) => {
    setSelectedSaleId(id);
    setIsDrawerOpen(true);
  };

  const handleRowsChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const renderError = () => (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center">
      <AlertTriangle className="size-12 text-rose-400" />
      <h2 className="mt-4 text-lg font-bold text-foreground">Unable to load sales.</h2>
      <p className="mt-2 text-sm text-[#94a3b8]">The backend sales API is unavailable.</p>
      <Button onClick={() => refetch()} size="sm" className="mt-4 gap-2 font-semibold">
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title="Sales Management" subtitle="Monitor orders, revenue, payments, and sales performance." />

      <SalesSummaryCards summary={data?.summary} isLoading={isLoading} />

      <SalesToolbar
        searchQuery={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetPage();
        }}
        orderStatus={orderStatus}
        onOrderStatusChange={(value) => {
          setOrderStatus(value);
          resetPage();
        }}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={(value) => {
          setPaymentStatus(value);
          resetPage();
        }}
        dateRange={dateRange}
        onDateRangeChange={(value) => {
          setDateRange(value);
          resetPage();
        }}
        customFrom={customFrom}
        customTo={customTo}
        onCustomFromChange={(value) => {
          setCustomFrom(value);
          resetPage();
        }}
        onCustomToChange={(value) => {
          setCustomTo(value);
          resetPage();
        }}
        onRefresh={() => refetch()}
        onExport={() => setIsExportOpen(true)}
        onCreate={handleOpenCreate}
        canCreate={canCreate}
      />

      {isError ? renderError() : isLoading ? <LoadingSkeleton /> : sales.length === 0 ? <EmptyState /> : (
        <div className="space-y-4">
          <SalesTable sales={sales} onView={handleView} />

          <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card/20 p-4 text-xs font-semibold text-[#94a3b8] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <span>Showing</span>
              <span className="text-white">
                {total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, total)}
              </span>
              <span>of</span>
              <span className="text-white">{total.toLocaleString()}</span>
              <span>sales</span>
              <select
                value={itemsPerPage}
                onChange={(event) => handleRowsChange(Number(event.target.value))}
                className="ml-2 h-7 rounded border border-border bg-background px-1 text-xs font-bold text-foreground outline-none focus:border-primary"
              >
                <option value={10}>10 Rows</option>
                <option value={25}>25 Rows</option>
                <option value={50}>50 Rows</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-border px-3 text-xs font-bold hover:bg-muted"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 px-2.5">
                <span>Page</span>
                <span className="font-bold text-white">{currentPage}</span>
                <span>of</span>
                <span className="font-bold text-white">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-border px-3 text-xs font-bold hover:bg-muted"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-[#94a3b8] hover:bg-white/10 hover:text-white"
            >
              <X className="size-5" />
            </button>
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <ShoppingCart className="size-5 text-primary" />
              New Sales Order
            </h3>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#94a3b8]">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(event) => setFormData({ ...formData, customerName: event.target.value })}
                  placeholder="Customer name"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#94a3b8]">Product *</label>
                <select
                  required
                  value={formData.productId}
                  onChange={(event) => handleProductChange(event.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.product_name} ({product.sku}) - {product.selling_price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#94a3b8]">Unit Price *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(event) => setFormData({ ...formData, sellingPrice: Number(event.target.value) })}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#94a3b8]">Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(event) => setFormData({ ...formData, quantity: Number(event.target.value) })}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-4">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={createMutation.isPending} className="gap-2">
                  {createMutation.isPending && <RefreshCw className="size-4 animate-spin" />}
                  Create Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SalesDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} saleId={selectedSaleId} />

      <ExportSalesDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        sales={exportRows}
        dateRange={dateRange}
        paymentStatus={paymentStatus}
        orderStatus={orderStatus}
      />
    </div>
  );
}
