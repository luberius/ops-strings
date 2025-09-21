import { proxy } from "valtio";
import type { Expense, Contact, Account } from "@/lib/bigcapital-api";

interface ExpenseFilters {
  search: string;
  vendorId?: number;
  status?: "published" | "draft" | "all";
  dateFrom?: string;
  dateTo?: string;
}

interface ExpenseStore {
  expenses: Expense[];
  vendors: Contact[];
  accounts: Account[];
  isLoading: boolean;
  filters: ExpenseFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export const expenseStore = proxy<ExpenseStore>({
  expenses: [],
  vendors: [],
  accounts: [],
  isLoading: false,
  filters: {
    search: "",
    status: "all",
  },
  pagination: {
    page: 1,
    pageSize: 50,
    total: 0,
  },
});

export const expenseActions = {
  setExpenses(expenses: Expense[]) {
    expenseStore.expenses = expenses;
  },

  setVendors(vendors: Contact[]) {
    expenseStore.vendors = vendors;
  },

  setAccounts(accounts: Account[]) {
    expenseStore.accounts = accounts;
  },

  setLoading(loading: boolean) {
    expenseStore.isLoading = loading;
  },

  updateFilters(filters: Partial<ExpenseFilters>) {
    expenseStore.filters = { ...expenseStore.filters, ...filters };
    expenseStore.pagination.page = 1;
  },

  setPagination(pagination: Partial<typeof expenseStore.pagination>) {
    expenseStore.pagination = { ...expenseStore.pagination, ...pagination };
  },

  addExpense(expense: Expense) {
    expenseStore.expenses.unshift(expense);
  },

  updateExpense(id: number, expense: Expense) {
    const index = expenseStore.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      expenseStore.expenses[index] = expense;
    }
  },

  removeExpense(id: number) {
    expenseStore.expenses = expenseStore.expenses.filter(e => e.id !== id);
  },
};