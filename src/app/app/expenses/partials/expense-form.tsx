"use client";

import { useState } from "react";
import { useSnapshot } from "valtio";
import { expenseStore, expenseActions } from "../store";
import { createExpense, updateExpense } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { ExpenseCategory } from "@/lib/bigcapital-api";

export function ExpenseForm() {
  const snap = useSnapshot(expenseStore);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    snap.selectedExpense?.payment_date
      ? new Date(snap.selectedExpense.payment_date)
      : new Date()
  );
  const [formData, setFormData] = useState({
    reference_no: snap.selectedExpense?.reference_no || "",
    payment_account_id: snap.selectedExpense?.payment_account_id || 1,
    vendor_id: snap.selectedExpense?.vendor_id || undefined,
    description: snap.selectedExpense?.description || "",
    categories: snap.selectedExpense?.categories || [
      {
        index: 1,
        expense_account_id: 0,
        amount: 0,
        description: "",
      },
    ],
    publish: false,
  });

  const handleSubmit = async () => {
    if (!date) return;

    setLoading(true);
    try {
      const validCategories = formData.categories.filter(
        (cat) => cat.expense_account_id && cat.amount
      );

      if (validCategories.length === 0) {
        alert("Please add at least one expense category with amount");
        return;
      }

      const expenseData = {
        payment_date: format(date, "yyyy-MM-dd"),
        payment_account_id: formData.payment_account_id,
        vendor_id: formData.vendor_id,
        reference_no: formData.reference_no || undefined,
        description: formData.description || undefined,
        categories: validCategories.map((cat, idx) => ({
          ...cat,
          index: idx + 1,
        })),
        publish: formData.publish,
      };

      if (snap.selectedExpense?.id) {
        const updated = await updateExpense(snap.selectedExpense.id, expenseData);
        expenseActions.updateExpense(snap.selectedExpense.id, updated);
      } else {
        const created = await createExpense(expenseData);
        expenseActions.addExpense(created);
      }

      expenseActions.closeForm();
    } catch (error) {
      console.error("Failed to save expense:", error);
      alert("Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          index: prev.categories.length + 1,
          expense_account_id: 0,
          amount: 0,
          description: "",
        },
      ],
    }));
  };

  const removeCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const updateCategory = (index: number, field: keyof ExpenseCategory, value: any) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat
      ),
    }));
  };

  const totalAmount = formData.categories.reduce(
    (sum, cat) => sum + (cat.amount || 0),
    0
  );

  return (
    <Dialog open={snap.isFormOpen} onOpenChange={(open) => !open && expenseActions.closeForm()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {snap.selectedExpense?.id ? "Edit Expense" : "New Expense"}
          </DialogTitle>
          <DialogDescription>
            Record a new expense transaction
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Reference No</Label>
              <Input
                id="reference"
                value={formData.reference_no}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reference_no: e.target.value }))
                }
                placeholder="EXP-001"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Select
                value={formData.vendor_id?.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, vendor_id: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {(snap.vendors || []).map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id.toString()}>
                      {vendor.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Payment Account</Label>
              <Select
                value={formData.payment_account_id.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    payment_account_id: parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(snap.accounts) ? snap.accounts.map((account: any) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name}
                    </SelectItem>
                  )) : snap.accounts?.data ? snap.accounts.data.map((account: any) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name}
                    </SelectItem>
                  )) : []}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Expense description..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Expense Categories</Label>
              <Button type="button" variant="outline" size="sm" onClick={addCategory}>
                <Plus className="h-4 w-4 mr-1" />
                Add Category
              </Button>
            </div>

            <div className="space-y-2">
              {formData.categories.map((category, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label className="text-xs">Account</Label>
                    <Select
                      value={category.expense_account_id?.toString()}
                      onValueChange={(value) =>
                        updateCategory(index, "expense_account_id", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {snap.accounts
                          .filter((acc: any) => acc.type === "expense")
                          .map((account: any) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                              {account.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Amount</Label>
                    <Input
                      type="number"
                      value={category.amount}
                      onChange={(e) =>
                        updateCategory(index, "amount", parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-4">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={category.description}
                      onChange={(e) =>
                        updateCategory(index, "description", e.target.value)
                      }
                      placeholder="Category description"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(index)}
                      disabled={formData.categories.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="publish"
                checked={formData.publish}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, publish: e.target.checked }))
                }
                className="rounded"
              />
              <Label htmlFor="publish" className="text-sm">
                Publish immediately
              </Label>
            </div>
            <div className="text-lg font-semibold">
              Total: ${totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => expenseActions.closeForm()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : snap.selectedExpense?.id ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}