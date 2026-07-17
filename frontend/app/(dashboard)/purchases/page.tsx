"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { ROLES, type Role } from "@/constants/roles";
import { useAuthStore } from "@/store/auth-store";
import { getProducts } from "@/services/product";
import { getFriendlyErrorMessage } from "@/utils/api-error";
import { usePurchases } from "@/features/purchases/hooks/usePurchases";
import { purchaseService } from "@/features/purchases/services/purchaseService";
import { PurchaseSummaryCards } from "@/features/purchases/components/PurchaseSummaryCards";
import { PurchaseToolbar } from "@/features/purchases/components/PurchaseToolbar";
import { PurchaseTable } from "@/features/purchases/components/PurchaseTable";
import { PurchaseDrawer } from "@/features/purchases/components/PurchaseDrawer";
import { CreatePurchaseDialog, type CreatePurchaseFormData } from "@/features/purchases/components/CreatePurchaseDialog";
import { ExportPurchaseDialog } from "@/features/purchases/components/ExportPurchaseDialog";
import { LoadingSkeleton } from "@/features/purchases/components/LoadingSkeleton";
import { EmptyState } from "@/features/purchases/components/EmptyState";
import type { DateRangeFilter, PurchasePaymentStatus, PurchaseStatus } from "@/features/purchases/types";

const PURCHASE_WRITE_ROLES: Role[] = [ROLES.ADMIN, ROLES.MANAGER, ROLES.STORE_MANAGER];

export default function PurchasesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const canCreate = Boolean(user && PURCHASE_WRITE_ROLES.includes(user.role));

  const [search, setSearch] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState<"All" | PurchaseStatus>("All");
  const [paymentStatus, setPaymentStatus] = useState<"All" | PurchasePaymentStatus>("All");
  const [warehouse, setWarehouse] = useState("All Warehouses");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("Last 30 Days");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filters = useMemo(
    () => ({
      search,
      purchaseStatus,
      paymentStatus,
      warehouse,
      dateRange,
      customFrom,
      customTo,
      page: currentPage,
      limit: itemsPerPage,
    }),
    [search, purchaseStatus, paymentStatus, warehouse, dateRange, customFrom, customTo, currentPage, itemsPerPage]
  );

  const { data, isLoading, isError, refetch } = usePurchases(filters);
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const purchases = data?.items ?? [];
  const exportRows = data?.exportRows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const createMutation = useMutation({
    mutationFn: (newPurchase: CreatePurchaseFormData) =>
      purchaseService.createPurchase({
        product_id: Number(newPurchase.productId),
        quantity: newPurchase.quantity,
        cost_price: newPurchase.unitCost,
        supplier_name: newPurchase.supplier,
      }),
    onSuccess: () => {
      toast.success("Purchase order created");
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error(getFriendlyErrorMessage(error));
    },
  });

  const resetPage = () => setCurrentPage(1);

  const handleOpenCreate = () => {
    if (!canCreate) return;

    if (products.length === 0) {
      toast.error("No products available in catalog. Please define a product first.");
      return;
    }

    setIsCreateOpen(true);
  };

  const handleView = (id: number) => {
    setSelectedPurchaseId(id);
    setIsDrawerOpen(true);
  };

  const handleRowsChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const renderError = () => (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center">
      <AlertTriangle className="size-12 text-rose-400" />
      <h2 className="mt-4 text-lg font-bold text-foreground">Unable to load purchases.</h2>
      <p className="mt-2 text-sm text-[#94a3b8]">The backend purchase API is unavailable.</p>
      <Button onClick={() => refetch()} size="sm" className="mt-4 gap-2 font-semibold">
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title="Purchase Management" subtitle="Monitor supplier orders, replenishment, delivery status, and purchase spend." />

      <PurchaseSummaryCards summary={data?.summary} isLoading={isLoading} />

      <PurchaseToolbar
        searchQuery={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetPage();
        }}
        purchaseStatus={purchaseStatus}
        onPurchaseStatusChange={(value) => {
          setPurchaseStatus(value);
          resetPage();
        }}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={(value) => {
          setPaymentStatus(value);
          resetPage();
        }}
        warehouse={warehouse}
        onWarehouseChange={(value) => {
          setWarehouse(value);
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

      {isError ? renderError() : isLoading ? <LoadingSkeleton /> : purchases.length === 0 ? <EmptyState /> : (
        <div className="space-y-4">
          <PurchaseTable purchases={purchases} onView={handleView} />

          <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card/20 p-4 text-xs font-semibold text-[#94a3b8] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <span>Showing</span>
              <span className="text-white">
                {total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, total)}
              </span>
              <span>of</span>
              <span className="text-white">{total.toLocaleString()}</span>
              <span>purchases</span>
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

      <CreatePurchaseDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        products={products}
        isSubmitting={createMutation.isPending}
        onSubmit={(payload) => createMutation.mutate(payload)}
      />

      <PurchaseDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} purchaseId={selectedPurchaseId} />

      <ExportPurchaseDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        purchases={exportRows}
        dateRange={dateRange}
        warehouse={warehouse}
        purchaseStatus={purchaseStatus}
      />
    </div>
  );
}
