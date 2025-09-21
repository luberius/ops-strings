"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { updateExpense, getExpenses, getAccounts, getVendors } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSnapshot } from "valtio";
import { expenseStore, expenseActions } from "../../store";
import type { ExpenseCategory } from "@/lib/bigcapital-api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditExpensePage({ params }: PageProps) {
  const router = useRouter();
  const snap = useSnapshot(expenseStore);
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [expense, setExpense] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [selectedAccountCurrency, setSelectedAccountCurrency] =
    useState<string>("IDR");
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [formData, setFormData] = useState({
    reference_no: "",
    payment_account_id: 1,
    vendor_id: undefined as number | undefined,
    description: "",
    exchange_rate: 1,
    categories: [
      {
        index: 1,
        expense_account_id: 0,
        amount: 0,
        description: "",
      },
    ],
    publish: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const expenseId = parseInt(resolvedParams.id);

        // Load vendors and accounts first
        const [vendorsRes, accountsRes] = await Promise.all([
          getVendors(1, 100),
          getAccounts(),
        ]);
        expenseActions.setVendors(vendorsRes.vendors || []);
        expenseActions.setAccounts(accountsRes.accounts || []);

        // Then load expense
        let foundExpense = snap.expenses.find((e) => e.id === expenseId);

        if (!foundExpense) {
          try {
            const response = await getExpenses(1, 50);
            expenseActions.setExpenses(response.expenses);
            foundExpense = response.expenses.find(
              (e: any) => e.id === expenseId,
            );
          } catch (error) {
            console.error("Failed to load expense:", error);
          }
        }

        if (foundExpense) {
          setExpense(foundExpense);
          setDate(new Date(foundExpense.payment_date));

          // Set currency and exchange rate from existing expense
          const paymentAccount = accountsRes.accounts?.find(
            (acc: any) => acc.id === foundExpense.payment_account_id,
          );
          if (paymentAccount) {
            setSelectedAccountCurrency(paymentAccount.currency_code || "IDR");
            setExchangeRate(foundExpense.exchange_rate || 1);
          }

          setFormData({
            reference_no: foundExpense.reference_no || "",
            payment_account_id: foundExpense.payment_account_id || 1,
            vendor_id: foundExpense.vendor_id || undefined,
            description: foundExpense.description || "",
            exchange_rate: foundExpense.exchange_rate || 1,
            categories: foundExpense.categories || [
              {
                index: 1,
                expense_account_id: 0,
                amount: 0,
                description: "",
              },
            ],
            publish: foundExpense.is_published || false,
          });
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [resolvedParams.id]);

  const handleSubmit = async () => {
    if (!date || !expense) return;

    setLoading(true);
    try {
      const validCategories = formData.categories.filter(
        (cat) => cat.expense_account_id && cat.amount,
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
        exchange_rate: exchangeRate !== 1 ? exchangeRate : undefined,
        categories: validCategories.map((cat, idx) => ({
          ...cat,
          index: idx + 1,
        })),
        publish: formData.publish,
      };

      const updated = await updateExpense(expense.id, expenseData);
      expenseActions.updateExpense(expense.id, updated);
      router.push("/app/expenses");
    } catch (error) {
      console.error("Failed to update expense:", error);
      alert("Failed to update expense");
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

  const updateCategory = (
    index: number,
    field: keyof ExpenseCategory,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat,
      ),
    }));
  };

  const totalAmount = formData.categories.reduce(
    (sum, cat) => sum + (cat.amount || 0),
    0,
  );

  if (dataLoading || !expense) {
    return (
      <div className="space-y-6 max-w-4xl md:mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/app/expenses")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl md:mx-auto sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/app/expenses")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Edit Expense</h1>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reference">Reference No</Label>
            <Input
              id="reference"
              value={formData.reference_no}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reference_no: e.target.value,
                }))
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
                    !date && "text-muted-foreground",
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor</Label>
            <Combobox
              options={(snap.vendors || []).map((vendor) => ({
                value: vendor.id.toString(),
                label: vendor.display_name,
              }))}
              value={formData.vendor_id?.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  vendor_id: value ? parseInt(value) : undefined,
                }))
              }
              placeholder="Select vendor..."
              searchPlaceholder="Search vendors..."
              emptyText="No vendor found."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Payment Account</Label>
            <Combobox
              options={(snap.accounts || [])
                .filter((account: any) => account.account_root_type === "asset")
                .map((account: any) => ({
                  value: account.id.toString(),
                  label: account.name,
                }))}
              value={formData.payment_account_id.toString()}
              onValueChange={(value) => {
                const accountId = parseInt(value);
                const selectedAccount = snap.accounts?.find(
                  (acc: any) => acc.id === accountId,
                );
                if (selectedAccount) {
                  setSelectedAccountCurrency(
                    selectedAccount.currency_code || "IDR",
                  );
                  if (
                    selectedAccount.currency_code === "IDR" ||
                    !selectedAccount.currency_code
                  ) {
                    setExchangeRate(1);
                  }
                }
                setFormData((prev) => ({
                  ...prev,
                  payment_account_id: accountId,
                }));
              }}
              placeholder="Select payment account..."
              searchPlaceholder="Search accounts..."
              emptyText="No account found."
            />
          </div>
        </div>

        {selectedAccountCurrency && selectedAccountCurrency !== "IDR" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exchange Rate</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm">1 {selectedAccountCurrency} =</span>
                <Input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) =>
                    setExchangeRate(parseFloat(e.target.value) || 1)
                  }
                  className="w-32"
                  step="0.01"
                  min="0.01"
                />
                <span className="text-sm">IDR</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Amount in IDR</Label>
              <div className="text-lg font-semibold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(totalAmount * exchangeRate)}
              </div>
            </div>
          </div>
        )}

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

        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Label className="text-base font-semibold">
              Expense Categories
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCategory}
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Add Category</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          <div className="space-y-3">
            {formData.categories.map((category, index) => (
              <div
                key={index}
                className="bg-background rounded-lg p-3 border"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-2 items-end">
                  <div className="sm:col-span-5">
                    <Label className="text-xs">Account</Label>
                    <Combobox
                      options={(snap.accounts || [])
                        .filter(
                          (acc: any) => acc.account_root_type === "expense",
                        )
                        .map((account: any) => ({
                          value: account.id.toString(),
                          label: account.name,
                        }))}
                      value={category.expense_account_id?.toString()}
                      onValueChange={(value) =>
                        updateCategory(
                          index,
                          "expense_account_id",
                          value ? parseInt(value) : 0,
                        )
                      }
                      placeholder="Select expense account..."
                      searchPlaceholder="Search accounts..."
                      emptyText="No account found."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs">Amount</Label>
                    <Input
                      type="number"
                      value={category.amount}
                      onChange={(e) =>
                        updateCategory(
                          index,
                          "amount",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={category.description}
                      onChange={(e) =>
                        updateCategory(index, "description", e.target.value)
                      }
                      placeholder="Category description"
                    />
                  </div>
                  <div className="sm:col-span-1 flex sm:justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(index)}
                      disabled={formData.categories.length === 1}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t pt-4">
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

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/app/expenses")}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Updating..." : "Update Expense"}
          </Button>
        </div>
      </div>
    </div>
  );
}
