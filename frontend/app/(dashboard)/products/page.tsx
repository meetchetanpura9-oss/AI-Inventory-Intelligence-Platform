"use client";

import React, { useState, useMemo } from "react";
import { Package, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/cards/MetricCard";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth-store";
import { PRODUCT_WRITE_ROLES, PRODUCT_DELETE_ROLES } from "@/constants/roles";

// Imports from the products feature module
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCreateProduct } from "@/features/products/hooks/useCreateProduct";
import { useUpdateProduct } from "@/features/products/hooks/useUpdateProduct";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteProduct";

import { ProductToolbar } from "@/features/products/components/ProductToolbar";
import { ProductTable } from "@/features/products/components/ProductTable";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductForm } from "@/features/products/components/ProductForm";
import { DeleteDialog } from "@/features/products/components/DeleteDialog";
import { ProductPagination } from "@/features/products/components/ProductPagination";
import type { CreateProduct, Product } from "@/features/products/types";

const AVAILABLE_CATEGORIES = ["Electronics", "Food", "Snacks", "Beverages", "Medicine"];

export default function ProductsPage() {
  const { user } = useAuthStore();

  // Role authorization checks
  const canWrite = Boolean(user && PRODUCT_WRITE_ROLES.includes(user.role));
  const canDelete = Boolean(user && PRODUCT_DELETE_ROLES.includes(user.role));

  // Filter, sort, pagination, search query parameters states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dialog & Modal toggle states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // React Query APIs Hook
  const { products, total, isLoading, isError, refetch } = useProducts({
    search: searchQuery,
    category: selectedCategory === "All" ? undefined : selectedCategory,
    page: currentPage,
    limit: itemsPerPage,
    sortBy,
    sortOrder,
  });

  // Mutators
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Reset pagination to first page when search or filters change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  // Sort callback
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Add Product Button Handler
  const handleAddClick = () => {
    if (!canWrite) {
      toast.error("Access denied. Managers or Administrators write permission required.");
      return;
    }
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // Edit Action Handler
  const handleEditClick = (prod: Product) => {
    if (!canWrite) {
      toast.error("Access denied. Managers or Administrators write permission required.");
      return;
    }
    setEditingProduct(prod);
    setIsFormOpen(true);
  };

  // Delete Action Trigger Handler
  const handleDeleteClick = (prod: Product) => {
    if (!canDelete) {
      toast.error("Access denied. Administrator privileges required to delete products.");
      return;
    }
    setDeletingProduct(prod);
    setIsDeleteDialogOpen(true);
  };

  // Form Submit Action Handler
  const handleFormSubmit = async (payload: CreateProduct) => {
    if (editingProduct) {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        payload,
      });
    } else {
      await createProductMutation.mutateAsync(payload);
    }
    setIsFormOpen(false);
  };

  // Delete Confirm Action Handler
  const handleDeleteConfirm = async () => {
    if (deletingProduct) {
      await deleteProductMutation.mutateAsync(deletingProduct.id);
      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
    }
  };

  // Filter products by stock status in frontend helper since Backend does not compute it dynamically
  const filteredProducts = useMemo(() => {
    return (products ?? []).filter((p) => {
      return selectedStatus === "All" || p?.status === selectedStatus;
    });
  }, [products, selectedStatus]);

  // Compute summary metrics (low-stock warning levels, etc.)
  const summaryMetrics = useMemo(() => {
    const totalCount = (products ?? []).length;
    const lowStockCount = (products ?? []).filter((p) => p?.status === "Warning").length;
    const outOfStockCount = (products ?? []).filter((p) => p?.status === "Critical").length;

    return [
      {
        label: "Total Products",
        value: `${totalCount} Items`,
        detail: "Active catalog items",
        icon: Package,
        changeType: "increase" as const,
      },
      {
        label: "Low Stock",
        value: `${lowStockCount} Items`,
        detail: "Require attention",
        icon: AlertTriangle,
        changeType: "decrease" as const,
      },
      {
        label: "Out of Stock",
        value: `${outOfStockCount} Items`,
        detail: "Critical reorders",
        icon: CheckCircle2,
        changeType: "decrease" as const,
      },
    ];
  }, [products]);

  // Shimmer Loader Skeletons
  const renderSkeleton = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl border border-border bg-card/45 animate-pulse" />
        ))}
      </div>
      <div className="h-14 rounded-xl border border-border bg-card/25 animate-pulse" />
      <div className="h-96 rounded-2xl border border-border bg-card/45 animate-pulse" />
    </div>
  );

  // Connection/API Error view
  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] border border-border bg-card rounded-2xl p-6 text-center space-y-4">
      <AlertTriangle className="size-12 text-[#ef4444] animate-bounce" />
      <h2 className="text-lg font-bold text-foreground">Failed to load product catalog</h2>
      <p className="text-sm text-[#94a3b8]">Could not connect to FastAPI server. Please check your network connection.</p>
      <Button onClick={() => refetch()} size="sm" className="gap-2 font-semibold">
        <RefreshCw className="size-4" />
        Retry Connection
      </Button>
    </div>
  );

  // Empty Database Table View
  const renderEmptyState = () => {
    const isFiltered = searchQuery !== "" || selectedCategory !== "All" || selectedStatus !== "All";
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] border border-border bg-card rounded-2xl p-8 text-center space-y-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Package className="size-7" />
        </div>
        <h3 className="text-base font-bold text-white">No Products Found</h3>
        <p className="text-xs text-[#94a3b8] max-w-sm">
          {isFiltered
            ? "We couldn't find any products matching your search or filters. Try adjusting your query or categories, or add a new product."
            : "Your catalog is currently empty. Add your first product to start tracking your inventory stock metrics."}
        </p>
        {canWrite && (
          <Button onClick={handleAddClick} size="sm" className="font-semibold gap-1">
            {isFiltered ? "Add Product" : "Add First Product"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog, categories, and safety stock levels."
      />

      {/* Show Skeleton Loader while fetching */}
      {isLoading ? (
        renderSkeleton()
      ) : isError ? (
        renderError()
      ) : (
        <>
          {/* Summary Metric KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {summaryMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <MetricCard
                  key={metric.label}
                  title={metric.label}
                  value={metric.value}
                  timeframe={metric.detail}
                  changeType={metric.changeType}
                  icon={<Icon className="size-5" />}
                />
              );
            })}
          </div>

          {/* Action Toolbar */}
          <ProductToolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            onAddClick={handleAddClick}
            onRefreshClick={refetch}
            categories={AVAILABLE_CATEGORIES}
            canAdd={canWrite}
          />

          {/* Catalog Data Visualizer */}
          {filteredProducts.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {/* Responsive Views: Table view on large screen, Card view on mobile/tablet */}
              <div className="hidden md:block">
                <ProductTable
                  products={filteredProducts}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  canEdit={canWrite}
                  canDelete={canDelete}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    canEdit={canWrite}
                    canDelete={canDelete}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <ProductPagination
                currentPage={currentPage}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          )}

          {/* Modals & Popups */}
          <ProductForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            initialData={editingProduct}
            isSubmitting={createProductMutation.isPending || updateProductMutation.isPending}
          />

          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            productName={deletingProduct?.product_name || ""}
            isDeleting={deleteProductMutation.isPending}
          />
        </>
      )}
    </div>
  );
}
