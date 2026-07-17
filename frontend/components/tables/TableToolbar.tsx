"use client";

import React, { type ReactNode } from "react";

interface TableToolbarProps {
  searchComponent?: ReactNode;
  filterComponents?: ReactNode;
  actionComponents?: ReactNode;
}

export function TableToolbar({
  searchComponent,
  filterComponents,
  actionComponents,
}: TableToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {searchComponent && <div className="w-full sm:max-w-xs">{searchComponent}</div>}
        {filterComponents && (
          <div className="flex items-center gap-2">
            {filterComponents}
          </div>
        )}
      </div>
      {actionComponents && (
        <div className="flex items-center gap-3">
          {actionComponents}
        </div>
      )}
    </div>
  );
}
export default TableToolbar;
