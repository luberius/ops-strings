"use server";

import { BigcapitalAPI } from "@/lib/bigcapital-api";
import type {
  Expense,
  ExpensesResponse,
  VendorsResponse,
  AccountsResponse,
  ExpenseCategory,
  Contact
} from "@/lib/bigcapital-api";

async function getApiClient(canSetCookie = false) {
  const apiUrl = process.env.BIGCAPITAL_API_URL || "https://fin2.syahril.dev";

  // First try to get API client from cookies
  let api = await BigcapitalAPI.fromCookies(apiUrl);

  if (!api) {
    // No valid cookie found, perform initial login
    const email = process.env.BIGCAPITAL_EMAIL;
    const password = process.env.BIGCAPITAL_PASSWORD;

    if (!email || !password || email === "your_email@example.com") {
      throw new Error(
        "Please configure BIGCAPITAL_EMAIL and BIGCAPITAL_PASSWORD in .env.local file"
      );
    }

    // Login with cookie storage only when explicitly allowed (mutations)
    api = await BigcapitalAPI.login(email, password, apiUrl, canSetCookie);
  }

  return api;
}

export async function getExpenses(page = 1, pageSize = 50): Promise<ExpensesResponse> {
  try {
    const api = await getApiClient();
    return await api.getExpenses(page, pageSize);
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    throw new Error("Failed to fetch expenses");
  }
}

export async function getExpense(id: number): Promise<Expense> {
  try {
    const api = await getApiClient();
    return await api.getExpense(id);
  } catch (error) {
    console.error(`Failed to fetch expense ${id}:`, error);
    throw new Error("Failed to fetch expense");
  }
}

export async function createExpense(data: Partial<Expense>): Promise<Expense> {
  try {
    const api = await getApiClient(true); // Allow cookie setting for mutations
    return await api.createExpense(data);
  } catch (error) {
    console.error("Failed to create expense:", error);
    throw new Error("Failed to create expense");
  }
}

export async function updateExpense(
  id: number,
  data: Partial<Expense>
): Promise<Expense> {
  try {
    const api = await getApiClient(true); // Allow cookie setting for mutations
    return await api.updateExpense(id, data);
  } catch (error) {
    console.error(`Failed to update expense ${id}:`, error);
    throw new Error("Failed to update expense");
  }
}

export async function deleteExpense(id: number): Promise<void> {
  try {
    const api = await getApiClient(true); // Allow cookie setting for mutations
    return await api.deleteExpense(id);
  } catch (error) {
    console.error(`Failed to delete expense ${id}:`, error);
    throw new Error("Failed to delete expense");
  }
}

export async function publishExpense(id: number): Promise<Expense> {
  try {
    const api = await getApiClient(true); // Allow cookie setting for mutations
    return await api.publishExpense(id);
  } catch (error) {
    console.error(`Failed to publish expense ${id}:`, error);
    throw new Error("Failed to publish expense");
  }
}

export async function getVendors(page = 1, pageSize = 100): Promise<VendorsResponse> {
  try {
    const api = await getApiClient();
    return await api.getVendors(page, pageSize);
  } catch (error) {
    console.error("Failed to fetch vendors:", error);
    throw new Error("Failed to fetch vendors");
  }
}

export async function getAccounts(): Promise<AccountsResponse> {
  try {
    const api = await getApiClient();
    return await api.getAccounts();
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    throw new Error("Failed to fetch accounts");
  }
}