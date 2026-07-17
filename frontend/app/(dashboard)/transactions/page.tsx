"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { SummaryCards } from "@/features/transactions/components/SummaryCards";
import { TransactionToolbar } from "@/features/transactions/components/TransactionToolbar";
import { TransactionTable } from "@/features/transactions/components/TransactionTable";
import { TransactionDetailsDrawer } from "@/features/transactions/components/TransactionDetailsDrawer";
import { ExportDialog } from "@/features/transactions/components/ExportDialog";
import type { DateRangeFilter, TransactionType } from "@/features/transactions/types";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [transactionType, setTransactionType] = useState<"All" | TransactionType>("All");
  const [warehouse, setWarehouse] = useState("All Warehouses");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("Last 30 Days");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filters = useMemo(
    () => ({
      search,
      transactionType,
      warehouse,
      dateRange,
      customFrom,
      customTo,
      page: currentPage,
      limit: itemsPerPage,
    }),
    [search, transactionType, warehouse, dateRange, customFrom, customTo, currentPage, itemsPerPage]
  );

  const { data, isLoading, isError, refetch } = useTransactions(filters);
  const transactions = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const resetPage = () => setCurrentPage(1);

  const handleView = (id: number) => {
    setSelectedTransactionId(id);
    setIsDrawerOpen(true);
  };

  const handleRowsChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const renderTableSkeleton = () => (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <Skeleton className="h-10 w-full bg-white/10" />
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full bg-white/10" />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FileText className="size-7" />
      </div>
      <h3 className="mt-4 text-base font-bold text-white">No Transactions Found</h3>
      <p className="mt-2 max-w-sm text-xs text-[#94a3b8]">Try changing filters.</p>
    </div>
  );

  const renderError = () => (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center">
      <AlertTriangle className="size-12 text-rose-400" />
      <h2 className="mt-4 text-lg font-bold text-foreground">Unable to load transactions.</h2>
      <p className="mt-2 text-sm text-[#94a3b8]">The backend inventory transaction API is unavailable.</p>
      <Button onClick={() => refetch()} size="sm" className="mt-4 gap-2 font-semibold">
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title="Inventory Transactions" subtitle="Track every inventory movement" />

      <SummaryCards summary={data?.summary} isLoading={isLoading} />

      <TransactionToolbar
        searchQuery={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetPage();
        }}
        selectedType={transactionType}
        onTypeChange={(value) => {
          setTransactionType(value);
          resetPage();
        }}
        selectedWarehouse={warehouse}
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
      />

      {isError ? renderError() : isLoading ? renderTableSkeleton() : transactions.length === 0 ? renderEmptyState() : (
        <div className="space-y-4">
          <TransactionTable transactions={transactions} onView={handleView} />

          <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card/20 p-4 text-xs font-semibold text-[#94a3b8] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <span>Showing</span>
              <span className="text-white">
                {total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, total)}
              </span>
              <span>of</span>
              <span className="text-white">{total.toLocaleString()}</span>
              <span>transactions</span>
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

      <TransactionDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        transactionId={selectedTransactionId}
      />

      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        transactions={transactions}
        dateRange={dateRange}
        transactionType={transactionType}
        warehouse={warehouse}
      />
    </div>
  );
}
