/**
 * Bigcapital API Client
 *
 * This TypeScript client provides a typed interface to the Bigcapital accounting API.
 *
 * ## Authentication Flow:
 *
 * 1. **Login**: Use the static `login()` method to authenticate
 *    ```typescript
 *    const api = await BigcapitalAPI.login('email@example.com', 'password');
 *    ```
 *    This returns an API instance with:
 *    - JWT token stored internally
 *    - Organization ID extracted from tenant info
 *    - User and tenant data accessible via the returned object
 *
 * 2. **Headers**: Each request automatically includes:
 *    - `x-access-token`: JWT token for authentication
 *    - `organization-id`: Tenant organization ID (for multi-tenant isolation)
 *    - `Content-Type`: application/json
 *
 * ## Multi-Tenancy:
 *
 * Bigcapital uses multi-tenant architecture where each organization has isolated data.
 * The `organization-id` header is REQUIRED for all authenticated endpoints to identify
 * which tenant's data to access.
 *
 * ## API Structure:
 *
 * - **Contacts**: Unified interface for customers and vendors
 *   - Customers: `/api/customers/*`
 *   - Vendors: `/api/vendors/*`
 *
 * - **Items**: Products and services
 *   - `/api/items/*`
 *
 * - **Sales**: Invoices and related operations
 *   - `/api/sales/invoices/*`
 *
 * - **Expenses**: Expense tracking
 *   - `/api/expenses/*`
 *
 * ## HTTP Methods:
 *
 * - GET: Retrieve data
 * - POST: Create new records AND update existing records
 * - DELETE: Remove records
 *
 * Note: Updates use POST (not PUT) in the Bigcapital API
 *
 * ## Error Handling:
 *
 * The client throws errors with descriptive messages for:
 * - 401: Invalid token or missing organization-id
 * - 403: Permission denied
 * - 400: Validation errors
 * - 500: Server errors
 *
 * ## Usage Example:
 *
 * ```typescript
 * // Login and get API instance
 * const api = await BigcapitalAPI.login('user@example.com', 'password');
 *
 * // Create a customer
 * const customer = await api.createCustomer({
 *   display_name: 'John Doe',
 *   email: 'john@example.com',
 *   currency_code: 'USD'
 * });
 *
 * // Get all invoices
 * const invoices = await api.getInvoices();
 *
 * // Create an expense
 * const expense = await api.createExpense({
 *   payment_date: '2024-01-15',
 *   payment_account_id: 1,
 *   categories: [{
 *     expense_account_id: 2,
 *     amount: 100,
 *     description: 'Office supplies'
 *   }]
 * });
 * ```
 *
 * ## Attachments Workflow:
 *
 * Attachments can be added to invoices, expenses, bills, and other documents.
 * There are two methods to attach files:
 *
 * ### Method 1: Include attachments when creating/editing
 * ```typescript
 * // First upload the file
 * const attachment = await api.uploadAttachment(file);
 *
 * // Then create invoice with attachment
 * const invoice = await api.createInvoice({
 *   customer_id: 1,
 *   invoice_date: '2024-01-15',
 *   // ... other fields
 *   attachments: [
 *     { key: attachment.key }
 *   ]
 * });
 * ```
 *
 * ### Method 2: Link attachments separately
 * ```typescript
 * // Upload file
 * const attachment = await api.uploadAttachment(file);
 *
 * // Create invoice first
 * const invoice = await api.createInvoice({...});
 *
 * // Then link attachment
 * await api.linkAttachment(attachment.key, 'SaleInvoice', invoice.id);
 * ```
 *
 * ### Complete Example Workflow:
 * ```typescript
 * // 1. Upload the file first
 * const file = new File(['content'], 'invoice.pdf', { type: 'application/pdf' });
 * const attachment = await api.uploadAttachment(file);
 * // Returns: { key: '1698765432100', originName: 'invoice.pdf', mimeType: 'application/pdf', size: 102400 }
 *
 * // 2. Create invoice with attachment
 * const invoice = await api.createInvoice({
 *   customer_id: 1,
 *   invoice_date: '2024-01-15',
 *   due_date: '2024-02-15',
 *   invoice_no: 'INV-001',
 *   entries: [{
 *     item_id: 1,
 *     quantity: 1,
 *     rate: 100
 *   }],
 *   attachments: [
 *     { key: attachment.key }
 *   ]
 * });
 *
 * // Or for expense:
 * const expense = await api.createExpense({
 *   payment_date: '2024-01-15',
 *   payment_account_id: 1,
 *   categories: [{
 *     expense_account_id: 2,
 *     amount: 100,
 *     description: 'Office supplies'
 *   }],
 *   attachments: [
 *     { key: attachment.key }
 *   ]
 * });
 *
 * // 3. Download attachment
 * const fileData = await api.downloadAttachment(attachment.key);
 *
 * // 4. Delete attachment
 * await api.deleteAttachment(attachment.key);
 *
 * // 5. Get presigned URL for direct S3 access
 * const presignedUrl = await api.getAttachmentPresignedUrl(attachment.key);
 * ```
 *
 * ### Supported Entity Types for Linking:
 * - SaleInvoice - Sales invoices
 * - SaleEstimate - Sales estimates/quotes
 * - SaleReceipt - Sales receipts
 * - PaymentReceive - Payment received
 * - CreditNote - Credit notes
 * - Bill - Purchase bills
 * - PaymentMade - Bill payments
 * - VendorCredit - Vendor credits
 * - Expense - Expenses
 * - ManualJournal - Manual journal entries
 */

export interface Contact {
  id: number;
  display_name: string;
  contact_service: "customer" | "vendor";
  contact_type?: string;
  currency_code?: string;
  email?: string;
  work_phone?: string;
  personal_phone?: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  website?: string;
  note?: string;
  active: boolean;
  balance?: number;
  opening_balance?: number;
  opening_balance_at?: string;
  // Billing Address
  billing_address_1?: string;
  billing_address_2?: string;
  billing_address_city?: string;
  billing_address_country?: string;
  billing_address_state?: string;
  billing_address_zipcode?: string;
  billing_address_phone?: string;
  // Shipping Address
  shipping_address_1?: string;
  shipping_address_2?: string;
  shipping_address_city?: string;
  shipping_address_country?: string;
  shipping_address_state?: string;
  shipping_address_zipcode?: string;
  shipping_address_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Item {
  id: number;
  name: string;
  type: "service" | "non-inventory" | "inventory";
  code?: string;
  sellable?: boolean;
  purchasable?: boolean;
  sell_price?: number;
  cost_price?: number;
  sell_account_id?: number;
  cost_account_id?: number;
  inventory_account_id?: number;
  sell_description?: string;
  purchase_description?: string;
  quantity_on_hand?: number;
  category_id?: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceEntry {
  index?: number;
  item_id?: number;
  description?: string;
  quantity: number;
  rate: number;
  discount?: number;
  discount_type?: "amount" | "percentage";
  tax_rate_id?: number;
  warehouse_id?: number;
  project_id?: number;
}

export interface Invoice {
  id?: number;
  customer_id: number;
  invoice_date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  invoice_no: string;
  reference_no?: string;
  invoice_message?: string;
  terms_conditions?: string;
  entries: InvoiceEntry[];
  attachments?: Attachment[];
  delivered?: boolean;
  is_inclusive_tax?: boolean;
  currency_code?: string;
  exchange_rate?: number;
  warehouse_id?: number;
  branch_id?: number;
  project_id?: number;
  // Computed fields from server
  amount?: number;
  payment_amount?: number;
  due_amount?: number;
  overdue_days?: number;
  is_delivered?: boolean;
  delivered_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Account {
  id: number;
  name: string;
  slug: string;
  account_type: string;
  parent_account_id?: number | null;
  code: string;
  description?: string;
  active: number;
  index?: number | null;
  predefined: number;
  amount?: number;
  currency_code: string;
  seeded_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  plaid_account_id?: string | null;
  account_mask?: string | null;
  bank_balance?: number | null;
  uncategorized_transactions?: number;
  is_system_account?: number;
  is_feeds_active?: number;
  is_syncing_owner?: number;
  last_feeds_updated_at?: string | null;
  plaid_item_id?: string | null;
  account_type_label?: string;
  account_parent_type?: string;
  account_root_type?: string;
  account_normal?: string;
  account_normal_formatted?: string;
  is_balance_sheet_account?: boolean;
  is_pl_sheet?: boolean;
}

export interface ExpenseCategory {
  id?: number;
  index?: number;
  expense_id?: number;
  expense_account_id: number;
  amount: number;
  amount_formatted?: string;
  description?: string;
  landed_cost?: number;
  project_id?: number;
  allocated_cost_amount?: number;
  unallocated_cost_amount?: number;
  expense_account?: Account;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Attachment {
  key: string;
  mime_type?: string;
  mimeType?: string;
  origin_name?: string;
  originName?: string;
  size?: number;
  updated_at?: string | null;
}

export interface AttachmentUploadResponse {
  status: number;
  message: string;
  data: {
    id?: number;
    key: string;
    mimeType: string;
    size: number;
    originName: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface Expense {
  id?: number;
  reference_no?: string | null;
  payment_date: string; // YYYY-MM-DD
  payment_account_id: number;
  payee_id?: number | null; // vendor_id
  description?: string | null;
  currency_code?: string;
  exchange_rate?: number;
  branch_id?: number | null;
  project_id?: number | null;
  categories: ExpenseCategory[];
  attachments?: Attachment[];
  // Computed fields from server
  total_amount?: number;
  formatted_amount?: string;
  local_amount?: number;
  allocated_cost_amount?: number;
  unallocated_cost_amount?: number;
  landed_cost_amount?: number;
  billable_amount?: number;
  invoiced_amount?: number;
  local_allocated_cost_amount?: number;
  local_unallocated_cost_amount?: number;
  local_landed_cost_amount?: number;
  formatted_allocated_cost_amount?: string;
  formatted_landed_cost_amount?: string;
  formatted_created_at?: string;
  formatted_date?: string;
  formatted_published_at?: string;
  is_published?: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string | null;
  user_id?: number;
  payment_account?: Account;
  // For creating/updating
  publish?: boolean;
}

// Generic paginated response type
export interface PaginationMeta {
  total: number;
  page: number;
  page_size: number;
}

export interface FilterMeta {
  sort_order?: string;
  sort_by?: string;
}

// Generic response wrapper that matches actual API structure
export interface ApiResponse<T> {
  pagination?: PaginationMeta;
  filter_meta?: FilterMeta;
  [key: string]: T | PaginationMeta | FilterMeta | undefined;
}

// Specific response types
export interface ExpensesResponse extends ApiResponse<Expense[]> {
  expenses: Expense[];
}

export interface VendorsResponse extends ApiResponse<Contact[]> {
  vendors: Contact[];
}

export interface CustomersResponse extends ApiResponse<Contact[]> {
  customers: Contact[];
}

export interface InvoicesResponse extends ApiResponse<Invoice[]> {
  invoices: Invoice[];
}

export interface ItemsResponse extends ApiResponse<Item[]> {
  items: Item[];
}

export interface AccountsResponse extends ApiResponse<Account[]> {
  accounts: Account[];
}

import { getAuthCookie, setAuthCookie, clearAuthCookie, type AuthData } from './auth-cookies';

export class BigcapitalAPI {
  private baseUrl: string;
  private token: string;
  public tenantId?: string | number;
  public organizationId?: string;
  private email?: string;
  private password?: string;
  private retryCount = 0;
  private maxRetries = 3;

  constructor(token: string, baseUrl = "https://fin2.syahril.dev") {
    this.token = token;
    this.baseUrl = baseUrl;
  }

  static async login(
    email: string,
    password: string,
    baseUrl = "https://fin2.syahril.dev",
    shouldStoreCookie = true,
  ): Promise<BigcapitalAPI> {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crediential: email, // Note: API expects 'crediential' (typo in API)
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Login failed: ${error}`);
    }

    const data = await response.json();
    const api = new BigcapitalAPI(data.token, baseUrl);
    api.tenantId = data.tenant?.id || data.tenant_id;
    api.organizationId = data.tenant?.organizationId || data.tenant?.organization_id;
    api.email = email;
    api.password = password;

    // Store auth data in cookies only if requested (for Server Actions)
    if (shouldStoreCookie) {
      try {
        await setAuthCookie({
          token: data.token,
          tenantId: api.tenantId,
          organizationId: api.organizationId,
          email: email
        });
      } catch (e) {
        // Silently fail if not in Server Action context
        console.log("[BigcapitalAPI] Could not store auth cookie (not in Server Action context)");
      }
    }

    return api;
  }

  static async fromCookies(baseUrl = "https://fin2.syahril.dev"): Promise<BigcapitalAPI | null> {
    const authData = await getAuthCookie();
    if (!authData) {
      return null;
    }

    const api = new BigcapitalAPI(authData.token, baseUrl);
    api.tenantId = authData.tenantId;
    api.organizationId = authData.organizationId;
    api.email = authData.email;
    return api;
  }

  private async request<T = any>(
    method: string,
    endpoint: string,
    data?: any,
    headers?: HeadersInit,
    isRetry = false,
  ): Promise<T> {
    const requestHeaders: HeadersInit = {
      "x-access-token": this.token,
      "Content-Type": "application/json",
      ...headers,
    };

    // Add organization-id header if available (required for tenant-specific operations)
    if (this.organizationId) {
      requestHeaders["organization-id"] = this.organizationId;
    }

    const options: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    // Handle 401 Unauthorized with retry logic
    if (response.status === 401 && !isRetry) {
      console.log(`[BigcapitalAPI] Got 401, attempting to re-authenticate (attempt ${this.retryCount + 1}/${this.maxRetries})`);

      if (this.retryCount >= this.maxRetries) {
        try {
          await clearAuthCookie();
        } catch {
          // Silently fail if not in Server Action context
        }
        throw new Error("Bigcapital account is invalid: Failed to authenticate after 3 attempts");
      }

      this.retryCount++;

      try {
        // Try to re-authenticate using stored credentials from environment
        const email = this.email || process.env.BIGCAPITAL_EMAIL;
        const password = this.password || process.env.BIGCAPITAL_PASSWORD;

        if (!email || !password) {
          throw new Error("Cannot re-authenticate: Missing credentials");
        }

        // Re-login (with cookie storage if possible)
        const newApi = await BigcapitalAPI.login(email, password, this.baseUrl, true);

        // Update current instance with new auth data
        this.token = newApi.token;
        this.tenantId = newApi.tenantId;
        this.organizationId = newApi.organizationId;

        // Retry the original request with new token
        return this.request(method, endpoint, data, headers, true);
      } catch (reAuthError) {
        console.error(`[BigcapitalAPI] Re-authentication failed:`, reAuthError);

        if (this.retryCount >= this.maxRetries) {
          try {
            await clearAuthCookie();
          } catch {
            // Silently fail if not in Server Action context
          }
          throw new Error("Bigcapital account is invalid: Failed to authenticate after 3 attempts");
        }

        // Try again if we haven't reached max retries
        return this.request(method, endpoint, data, headers, false);
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[BigcapitalAPI] Error Response:`, JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        endpoint,
        method,
        body: errorText
      }, null, 2));
      let errorMessage: string;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorText;
      } catch {
        errorMessage = errorText;
      }
      throw new Error(`API Error ${response.status}: ${errorMessage}`);
    }

    // Reset retry count on successful request
    this.retryCount = 0;

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const jsonResponse = await response.json();
      console.log(`[BigcapitalAPI] Response:`, JSON.stringify({
        endpoint,
        method,
        status: response.status,
        data: jsonResponse
      }, null, 2));
      return jsonResponse;
    }
    console.log(`[BigcapitalAPI] Non-JSON Response:`, JSON.stringify({
      endpoint,
      method,
      status: response.status,
      contentType
    }, null, 2));
    return response as any;
  }

  async getCustomers(
    page = 1,
    pageSize = 100,
  ): Promise<CustomersResponse> {
    return this.request(
      "GET",
      `/api/customers?page=${page}&page_size=${pageSize}`,
    );
  }

  async getVendors(
    page = 1,
    pageSize = 100,
  ): Promise<VendorsResponse> {
    return this.request(
      "GET",
      `/api/vendors?page=${page}&page_size=${pageSize}`,
    );
  }

  async getCustomer(id: number): Promise<Contact> {
    return this.request("GET", `/api/customers/${id}`);
  }

  async createCustomer(customer: Partial<Contact>): Promise<Contact> {
    return this.request("POST", "/api/customers", customer);
  }

  async updateCustomer(
    id: number,
    customer: Partial<Contact>,
  ): Promise<Contact> {
    return this.request("POST", `/api/customers/${id}`, customer);
  }

  async getItems(page = 1, pageSize = 100): Promise<ItemsResponse> {
    return this.request("GET", `/api/items?page=${page}&page_size=${pageSize}`);
  }

  async getItem(id: number): Promise<Item> {
    return this.request("GET", `/api/items/${id}`);
  }

  async createItem(item: Partial<Item>): Promise<Item> {
    return this.request("POST", "/api/items", item);
  }

  async updateItem(id: number, item: Partial<Item>): Promise<Item> {
    return this.request("POST", `/api/items/${id}`, item);
  }

  async getInvoices(page = 1, pageSize = 100): Promise<InvoicesResponse> {
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
    return this.request("POST", `/api/sales/invoices/${id}`, invoice);
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

  // Note: User info is returned during login, no separate /me endpoint exists

  // Set organization context for multi-tenant requests
  setOrganizationId(organizationId: string): void {
    this.organizationId = organizationId;
  }

  // Organization endpoints require authentication
  async getOrganization(): Promise<any> {
    return this.request("GET", "/api/organization");
  }

  async updateOrganization(organizationData: Partial<{
    name: string;
    industry?: string;
    location: string;
    base_currency: string;
    timezone: string;
    fiscal_year: string;
    language: string;
    date_format?: string;
    tax_number?: string;
  }>): Promise<any> {
    return this.request("PUT", "/api/organization", organizationData);
  }

  async getAccounts(): Promise<AccountsResponse> {
    return this.request("GET", "/api/accounts");
  }

  async getTaxRates(): Promise<any> {
    return this.request("GET", "/api/settings/tax-rates");
  }

  async getExpenses(page = 1, pageSize = 100): Promise<ExpensesResponse> {
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
    return this.request("POST", `/api/expenses/${id}`, expense);
  }

  async deleteExpense(id: number): Promise<void> {
    return this.request("DELETE", `/api/expenses/${id}`);
  }

  async publishExpense(id: number): Promise<Expense> {
    return this.request("POST", `/api/expenses/${id}/publish`);
  }

  // Additional vendor methods
  async getVendor(id: number): Promise<Contact> {
    return this.request("GET", `/api/vendors/${id}`);
  }

  async createVendor(vendor: Partial<Contact>): Promise<Contact> {
    return this.request("POST", "/api/vendors", vendor);
  }

  async updateVendor(id: number, vendor: Partial<Contact>): Promise<Contact> {
    return this.request("POST", `/api/vendors/${id}`, vendor);
  }

  async deleteVendor(id: number): Promise<void> {
    return this.request("DELETE", `/api/vendors/${id}`);
  }

  async deleteCustomer(id: number): Promise<void> {
    return this.request("DELETE", `/api/customers/${id}`);
  }

  async deleteItem(id: number): Promise<void> {
    return this.request("DELETE", `/api/items/${id}`);
  }

  // Contact activation/deactivation
  async activateContact(id: number): Promise<void> {
    return this.request("POST", `/api/contacts/${id}/activate`);
  }

  async inactivateContact(id: number): Promise<void> {
    return this.request("POST", `/api/contacts/${id}/inactivate`);
  }

  // Item activation/deactivation
  async activateItem(id: number): Promise<void> {
    return this.request("POST", `/api/items/${id}/activate`);
  }

  async inactivateItem(id: number): Promise<void> {
    return this.request("POST", `/api/items/${id}/inactivate`);
  }

  // Invoice writeoff
  async writeoffInvoice(
    id: number,
    writeoffData: {
      expense_account_id: number;
      date: string;
      reason?: string;
    },
  ): Promise<void> {
    return this.request("POST", `/api/sales/invoices/${id}/writeoff`, writeoffData);
  }

  async cancelInvoiceWriteoff(id: number): Promise<void> {
    return this.request("POST", `/api/sales/invoices/${id}/writeoff/cancel`);
  }

  // Invoice notifications
  async sendInvoiceSms(
    id: number,
    smsData: {
      notification_key: string;
    },
  ): Promise<void> {
    return this.request("POST", `/api/sales/invoices/${id}/notify-by-sms`, smsData);
  }

  async sendInvoiceReminder(
    id: number,
    emailData: {
      to: string[];
      subject?: string;
      message?: string;
    },
  ): Promise<void> {
    return this.request("POST", `/api/sales/invoices/${id}/mail-reminder`, emailData);
  }

  // Get payable invoices
  async getPayableInvoices(customerId?: number): Promise<InvoicesResponse> {
    const params = customerId ? `?customer_id=${customerId}` : "";
    return this.request("GET", `/api/sales/invoices/payable${params}`);
  }

  // Get invoice payment transactions
  async getInvoicePaymentTransactions(id: number): Promise<any> {
    return this.request("GET", `/api/sales/invoices/${id}/payment-transactions`);
  }

  // Attachment methods
  async uploadAttachment(file: File | Blob): Promise<AttachmentUploadResponse['data']> {
    const formData = new FormData();
    formData.append('file', file);

    const requestHeaders: HeadersInit = {
      "x-access-token": this.token,
    };

    if (this.organizationId) {
      requestHeaders["organization-id"] = this.organizationId;
    }

    const response = await fetch(`${this.baseUrl}/api/attachments/`, {
      method: 'POST',
      headers: requestHeaders,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload attachment: ${errorText}`);
    }

    const result: AttachmentUploadResponse = await response.json();
    return result.data;
  }

  async downloadAttachment(key: string): Promise<Blob> {
    const requestHeaders: HeadersInit = {
      "x-access-token": this.token,
    };

    if (this.organizationId) {
      requestHeaders["organization-id"] = this.organizationId;
    }

    const response = await fetch(`${this.baseUrl}/api/attachments/${key}`, {
      method: 'GET',
      headers: requestHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to download attachment: ${errorText}`);
    }

    return response.blob();
  }

  async deleteAttachment(key: string): Promise<void> {
    return this.request("DELETE", `/api/attachments/${key}`);
  }

  async linkAttachment(key: string, modelRef: string, modelId: number): Promise<void> {
    return this.request("POST", `/api/attachments/${key}/link`, {
      modelRef,
      modelId,
    });
  }

  async unlinkAttachment(key: string, modelRef: string, modelId: number): Promise<void> {
    return this.request("POST", `/api/attachments/${key}/unlink`, {
      modelRef,
      modelId,
    });
  }

  async getAttachmentPresignedUrl(key: string): Promise<{ presignedUrl: string }> {
    return this.request("GET", `/api/attachments/${key}/presigned-url`);
  }
}
export default BigcapitalAPI;
