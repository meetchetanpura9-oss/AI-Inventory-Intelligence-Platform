"use client";

import React, { useState } from "react";
import { AlertTriangle, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/auth-store";
import { INVENTORY_OPERATION_ROLES } from "@/constants/roles";

// Features imports
import { useInventory } from "@/features/inventory/hooks/useInventory";
import { InventorySummaryCards } from "@/features/inventory/components/InventorySummaryCards";
import { InventoryToolbar } from "@/features/inventory/components/InventoryToolbar";
import { InventoryTable } from "@/features/inventory/components/InventoryTable";
import { AddStockDialog } from "@/features/inventory/components/AddStockDialog";
import { RemoveStockDialog } from "@/features/inventory/components/RemoveStockDialog";
import { InventoryHistoryDrawer } from "@/features/inventory/components/InventoryHistoryDrawer";

export default function InventoryPage() {
  const { user } = useAuthStore();
  const canOperate = Boolean(user && INVENTORY_OPERATION_ROLES.includes(user.role));

  // State parameters for searching, filtering, and pagination
  const [search, setSearch] = useState("");
  const [warehouse, setWarehouse] = useState("All");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal dialog and drawer states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string>("");

  // Hook for querying inventory data
  const { data: inventory = [], total, isLoading, isError, refetch } = useInventory({
    search,
    warehouse,
    status,
    page: currentPage,
    limit: itemsPerPage,
  });

  // Action handlers
  const handleRefresh = () => {
    refetch();
  };

  const handleAddStockClick = () => {
    setSelectedProductId(null);
    setSelectedProductName("");
    setIsAddOpen(true);
  };

  const handleTableAddStock = (prodId: number, name: string) => {
    setSelectedProductId(prodId);
    setSelectedProductName(name);
    setIsAddOpen(true);
  };

  const handleTableRemoveStock = (prodId: number, name: string) => {
    setSelectedProductId(prodId);
    setSelectedProductName(name);
    setIsRemoveOpen(true);
  };

  const handleTableHistory = (prodId: number, name: string) => {
    setSelectedProductId(prodId);
    setSelectedProductName(name);
    setIsHistoryOpen(true);
  };

  // Reset pagination to first page when search/filters change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleWarehouseChange = (val: string) => {
    setWarehouse(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  const renderTableSkeleton = () => (
    <div className="space-y-4 animate-pulse select-none">
      <div className="h-10 w-full rounded-lg bg-white/10" />
      <div className="h-12 w-full rounded-xl bg-white/10" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 w-full rounded-xl bg-white/10" />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[300px] border border-border bg-card rounded-2xl p-8 text-center space-y-4 select-none">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Layers className="size-7" />
      </div>
      <h3 className="text-base font-bold text-white flex items-center gap-1.5 justify-center">
        <span>📦</span> No Inventory Found
      </h3>
      <p className="text-xs text-[#94a3b8] max-w-sm">
        Try changing filters or add stock.
      </p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] border border-border bg-card rounded-2xl p-6 text-center space-y-4 select-none">
      <AlertTriangle className="size-12 text-[#ef4444]" />
      <h2 className="text-lg font-bold text-foreground">Unable to load inventory.</h2>
      <p className="text-sm text-[#94a3b8]">Could not connect to FastAPI server. Please check backend connection.</p>
      <Button onClick={handleRefresh} size="sm" className="gap-2 font-semibold">
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <PageHeader
        title="Inventory"
        subtitle="Manage inventory across all warehouses."
      />

      {/* KPI Cards Grid */}
      <InventorySummaryCards />

      {/* Action Toolbar */}
      <InventoryToolbar
        searchQuery={search}
        onSearchChange={handleSearchChange}
        selectedWarehouse={warehouse}
        onWarehouseChange={handleWarehouseChange}
        selectedStatus={status}
        onStatusChange={handleStatusChange}
        onRefresh={handleRefresh}
        onAddStockClick={handleAddStockClick}
        canOperate={canOperate}
      />

      {/* Catalog / Stock Table View */}
      {isError ? (
        renderError()
      ) : isLoading ? (
        renderTableSkeleton()
      ) : inventory.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="space-y-4">
          <InventoryTable
            items={inventory}
            onAddStock={handleTableAddStock}
            onRemoveStock={handleTableRemoveStock}
            onViewHistory={handleTableHistory}
            canOperate={canOperate}
          />

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/20 border border-border/40 rounded-xl p-4 text-xs font-semibold text-[#94a3b8] select-none">
            <div className="flex items-center gap-1.5">
              <span>Showing</span>
              <span className="text-white">
                {total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, total)}
              </span>
              <span>of</span>
              <span className="text-white">{total}</span>
              <span>products</span>

              {/* Rows Per Page Selector */}
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="ml-3 h-7 rounded border border-border bg-background px-1 text-xs text-foreground outline-none cursor-pointer focus:border-primary font-bold"
              >
                <option value={10}>10 Rows</option>
                <option value={25}>25 Rows</option>
                <option value={50}>50 Rows</option>
              </select>
            </div>

            {/* Nav Page Controls */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-bold border-border px-3 hover:bg-muted"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1 px-2.5">
                <span>Page</span>
                <span className="text-white font-bold">{currentPage}</span>
                <span>of</span>
                <span className="text-white font-bold">{totalPages || 1}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-bold border-border px-3 hover:bg-muted"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Popups & Drawer overlays */}
      <AddStockDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        defaultProductId={selectedProductId}
      />

      <RemoveStockDialog
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        defaultProductId={selectedProductId}
      />

      <InventoryHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        productId={selectedProductId}
        productName={selectedProductName}
      />
    </div>
  );
}
