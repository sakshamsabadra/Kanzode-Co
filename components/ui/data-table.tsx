"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type RowValue = string | number | ReactNode | undefined;

interface Column<T> {
  key: keyof T;
  title: string;
  align?: "left" | "right";
  render?: (value: unknown, row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  rows: T[];
  rowHref?: (row: T) => string;
}

export function DataTable<T extends object>({
  columns,
  rows,
  rowHref
}: DataTableProps<T>) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      <div className="grid border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs uppercase tracking-[0.22em] text-slate-400" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
        {columns.map((column) => (
          <div
            key={String(column.key)}
            className={cn(column.align === "right" ? "text-right" : "text-left")}
          >
            {column.title}
          </div>
        ))}
      </div>

      <div>
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
            <p className="text-sm font-medium text-slate-500">No records found matching your selection.</p>
          </div>
        ) : (
          rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              onClick={() => {
                if (rowHref) {
                  router.push(rowHref(row));
                }
              }}
              className={cn(
                "grid items-center border-b border-slate-100 px-5 py-4 last:border-b-0",
                rowHref && "hover:bg-slate-50 transition-colors cursor-pointer"
              )}
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
            >
              {columns.map((column) => {
                const value = row[column.key] as unknown;
                return (
                  <div
                    key={String(column.key)}
                    className={cn(
                      "truncate pr-3 text-sm text-slate-700",
                      column.align === "right" ? "text-right" : "text-left"
                    )}
                  >
                    {column.render ? column.render(value, row) : (value as RowValue)}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
