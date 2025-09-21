"use client";

import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { expenseStore, expenseActions } from "../store";
import { deleteExpense, publishExpense } from "../actions";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, CheckCircle, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Expense } from "@/lib/bigcapital-api";

interface ExpenseListProps {
  initialData?: {
    expenses: any[];
    vendors: any[];
    accounts: any[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
    };
  };
}

export function ExpenseList({ initialData }: ExpenseListProps) {
  const snap = useSnapshot(expenseStore);
  const router = useRouter();

  // Initialize store with server data on first render
  useEffect(() => {
    if (initialData) {
      expenseActions.setExpenses(initialData.expenses);
      expenseActions.setVendors(initialData.vendors);
      expenseActions.setAccounts(initialData.accounts);
      expenseActions.setPagination(initialData.pagination);
    }
  }, []);

  const handleEdit = (expense: Expense) => {
    router.push(`/app/expenses/${expense.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      expenseActions.setLoading(true);
      await deleteExpense(id);
      expenseActions.removeExpense(id);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    } finally {
      expenseActions.setLoading(false);
    }
  };

  const handlePublish = async (id: number) => {
    try {
      expenseActions.setLoading(true);
      const updated = await publishExpense(id);
      expenseActions.updateExpense(id, updated);
    } catch (error) {
      console.error("Failed to publish expense:", error);
    } finally {
      expenseActions.setLoading(false);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (snap.isLoading && (!snap.expenses || snap.expenses.length === 0)) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!snap.expenses || snap.expenses.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center">
        <p className="text-muted-foreground">No expenses found</p>
        <Button
          className="mt-4"
          onClick={() => router.push("/app/expenses/new")}
        >
          Create First Expense
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(snap.expenses || []).map((expense) => {
            const vendor = (snap.vendors || []).find(v => v.id === expense.payee_id);
            return (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">
                  {expense.reference_no || `EXP-${expense.id}`}
                </TableCell>
                <TableCell>{formatDate(expense.payment_date)}</TableCell>
                <TableCell>{vendor?.display_name || "-"}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {expense.description || "-"}
                </TableCell>
                <TableCell className="text-right">
                  {expense.formatted_amount || formatCurrency(expense.total_amount)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      expense.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {expense.is_published ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(expense)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {!expense.is_published && (
                        <DropdownMenuItem onClick={() => handlePublish(expense.id!)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => {
                        router.push("/app/expenses/new");
                      }}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(expense.id!)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}