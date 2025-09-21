"use client";

import { useSnapshot } from "valtio";
import { expenseStore, expenseActions } from "../store";
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw } from "lucide-react";
import { getExpenses } from "../actions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function ExpenseActions() {
  const snap = useSnapshot(expenseStore);
  const router = useRouter();

  const handleRefresh = async () => {
    expenseActions.setLoading(true);
    try {
      const response = await getExpenses(
        snap.pagination.page,
        snap.pagination.pageSize,
      );
      if (response.pagination) {
        expenseActions.setPagination(response.pagination);
      }
      expenseActions.setExpenses(response.expenses);
    } catch (error) {
      console.error("Failed to refresh expenses:", error);
    } finally {
      expenseActions.setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["Reference", "Date", "Vendor", "Description", "Amount", "Status"],
      ...(snap.expenses || []).map((expense) => {
        const vendor = snap.vendors.find((v) => v.id === expense.vendor_id);
        return [
          expense.reference_no || `EXP-${expense.id}`,
          expense.payment_date,
          vendor?.display_name || "",
          expense.description || "",
          expense.total_amount?.toString() || "0",
          expense.published ? "Published" : "Draft",
        ];
      }),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Desktop: Normal inline buttons */}
      <div className="hidden sm:flex items-center gap-2">
        <Button
          onClick={() => router.push("/app/expenses/new")}
          className="flex items-center gap-2"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New Expense
        </Button>

        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={snap.isLoading}
          className="flex items-center gap-2"
          size="sm"
        >
          <RefreshCw
            className={cn("h-4 w-4", snap.isLoading && "animate-spin")}
          />
          Refresh
        </Button>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={!snap.expenses || snap.expenses.length === 0}
          className="flex items-center gap-2"
          size="sm"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Mobile: Secondary actions only (New button will be floating) */}
      <div className="flex sm:hidden gap-2">
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={snap.isLoading}
          className="flex items-center justify-center gap-2 flex-1"
          size="sm"
        >
          <RefreshCw
            className={cn("h-4 w-4", snap.isLoading && "animate-spin")}
          />
          Refresh
        </Button>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={!snap.expenses || snap.expenses.length === 0}
          className="flex items-center justify-center gap-2 flex-1"
          size="sm"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Mobile: Floating Action Button */}
      <Button
        onClick={() => router.push("/app/expenses/new")}
        className="fixed bottom-6 right-6 sm:hidden z-50 h-12 px-6 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
      >
        <Plus className="h-5 w-5" />
        <span>New</span>
      </Button>
    </>
  );
}
