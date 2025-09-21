export interface Customer {
  id: number;
  display_name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  billing_address?: any;
  shipping_address?: any;
  active: boolean;
  balance: number;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  type: "service" | "product";
  sell_price?: number;
  sell_account_id?: number;
  cost_price?: number;
  cost_account_id?: number;
  quantity_on_hand?: number;
  active: boolean;
}

export interface InvoiceEntry {
  item_id?: number;
  description: string;
  quantity: number;
  rate: number;
  total?: number;
  discount?: number;
  tax_rate_id?: number;
}

export interface Invoice {
  id?: number;
  customer_id: number;
  invoice_date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  invoice_no: string;
  reference_no?: string;
  note?: string;
  terms_conditions?: string;
  entries: InvoiceEntry[];
  discount?: number;
  discount_type?: "percentage" | "amount";
  adjustment?: number;
  message?: string;
  statement?: string;
}

export interface ExpenseCategory {
  index: number;
  expense_account_id: number;
  amount?: number;
  description?: string;
  landed_cost?: boolean;
  project_id?: number;
}

export interface Expense {
  id?: number;
  reference_no?: string;
  payment_date: string; // YYYY-MM-DD
  payment_account_id: number;
  vendor_id?: number;
  description?: string;
  exchange_rate?: number;
  currency_code?: string;
  branch_id?: number;
  categories: ExpenseCategory[];
  published?: boolean;
  publish?: boolean;
  total_amount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    page_size: number;
  };
}

export class BigcapitalAPI {
  private baseUrl: string;
  private token: string;
  private tenantId?: string;

  constructor(token: string, baseUrl = "https://fin2.syahril.dev") {
    this.token = token;
    this.baseUrl = baseUrl;
  }

  static async login(
    email: string,
    password: string,
    baseUrl = "https://fin2.syahril.dev",
  ): Promise<BigcapitalAPI> {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crediential: email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Login failed: ${error}`);
    }

    const data = await response.json();
    const api = new BigcapitalAPI(data.token, baseUrl);
    api.tenantId = data.tenant?.id;
    return api;
  }

  private async request<T = any>(
    method: string,
    endpoint: string,
    data?: any,
    headers?: HeadersInit,
  ): Promise<T> {
    const requestHeaders: HeadersInit = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      ...headers,
    };

    if (this.tenantId) {
      requestHeaders["x-tenant-id"] = this.tenantId.toString();
    }

    const options: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorText;
      } catch {
        errorMessage = errorText;
      }
      throw new Error(`API Error ${response.status}: ${errorMessage}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json();
    }
    return response as any;
  }

  async getCustomers(
    page = 1,
    pageSize = 100,
  ): Promise<ApiResponse<Customer[]>> {
    return this.request(
      "GET",
      `/api/contacts?page=${page}&page_size=${pageSize}&contact_service=customer`,
    );
  }

  async getCustomer(id: number): Promise<Customer> {
    return this.request("GET", `/api/contacts/${id}`);
  }

  async createCustomer(customer: Partial<Customer>): Promise<Customer> {
    return this.request("POST", "/api/contacts", {
      ...customer,
      contact_service: "customer",
    });
  }

  async updateCustomer(
    id: number,
    customer: Partial<Customer>,
  ): Promise<Customer> {
    return this.request("PUT", `/api/contacts/${id}`, customer);
  }

  async getItems(page = 1, pageSize = 100): Promise<ApiResponse<Item[]>> {
    return this.request("GET", `/api/items?page=${page}&page_size=${pageSize}`);
  }

  async getItem(id: number): Promise<Item> {
    return this.request("GET", `/api/items/${id}`);
  }

  async createItem(item: Partial<Item>): Promise<Item> {
    return this.request("POST", "/api/items", item);
  }

  async updateItem(id: number, item: Partial<Item>): Promise<Item> {
    return this.request("PUT", `/api/items/${id}`, item);
  }

  async getInvoices(page = 1, pageSize = 100): Promise<ApiResponse<Invoice[]>> {
    return this.request(
      "GET",
      `/api/sales/invoices?page=${page}&page_size=${pageSize}`,
    );
  }

  async getInvoice(id: number): Promise<Invoice> {
    return this.request("GET", `/api/sales/invoices/${id}`);
  }

  async createInvoice(invoice: Invoice): Promise<Invoice> {
    return this.request("POST", "/api/sales/invoices", invoice);
  }

  async updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice> {
    return this.request("PUT", `/api/sales/invoices/${id}`, invoice);
  }

  async deleteInvoice(id: number): Promise<void> {
    return this.request("DELETE", `/api/sales/invoices/${id}`);
  }

  async deliverInvoice(id: number): Promise<Invoice> {
    return this.request("POST", `/api/sales/invoices/${id}/deliver`);
  }

  async getInvoicePdf(id: number): Promise<Response> {
    return this.request("GET", `/api/sales/invoices/${id}`, null, {
      Accept: "application/pdf",
    });
  }

  async sendInvoice(
    id: number,
    emailData: {
      to: string[];
      subject?: string;
      message?: string;
    },
  ): Promise<any> {
    return this.request("POST", `/api/sales/invoices/${id}/mail`, emailData);
  }

  async getMe(): Promise<any> {
    return this.request("GET", "/api/auth/me");
  }

  async getOrganization(): Promise<any> {
    return this.request("GET", "/api/organization");
  }

  async getAccounts(): Promise<any> {
    return this.request("GET", "/api/accounts");
  }

  async getTaxRates(): Promise<any> {
    return this.request("GET", "/api/settings/tax-rates");
  }

  async getExpenses(page = 1, pageSize = 100): Promise<ApiResponse<Expense[]>> {
    return this.request(
      "GET",
      `/api/expenses?page=${page}&page_size=${pageSize}`,
    );
  }

  async getExpense(id: number): Promise<Expense> {
    return this.request("GET", `/api/expenses/${id}`);
  }

  async createExpense(expense: Partial<Expense>): Promise<Expense> {
    return this.request("POST", "/api/expenses", expense);
  }

  async updateExpense(id: number, expense: Partial<Expense>): Promise<Expense> {
    return this.request("PUT", `/api/expenses/${id}`, expense);
  }

  async deleteExpense(id: number): Promise<void> {
    return this.request("DELETE", `/api/expenses/${id}`);
  }

  async publishExpense(id: number): Promise<Expense> {
    return this.request("POST", `/api/expenses/${id}/publish`);
  }
}
export default BigcapitalAPI;
