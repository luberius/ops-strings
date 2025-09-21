# Bigcapital API Client Library

A TypeScript/JavaScript library for interacting with the Bigcapital accounting software API. This library provides a clean, typed interface for managing customers, items, and invoices programmatically.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [API Reference](#api-reference)
  - [Customers](#customers)
  - [Items](#items)
  - [Invoices](#invoices)
  - [Expenses](#expenses)
  - [Utility Methods](#utility-methods)
- [Types](#types)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Installation

### Option 1: Copy to Your Project

```bash
# Copy the library to your project
cp ~/.local/scripts/bigcapital-api.ts /path/to/your/project/lib/

# In your TypeScript/JavaScript file
import { BigcapitalAPI } from './lib/bigcapital-api';
```

### Option 2: Direct Import

```typescript
import { BigcapitalAPI } from '~/.local/scripts/bigcapital-api';
```

### Option 3: NPM Package (if published)

```bash
npm install bigcapital-api
# or
bun add bigcapital-api
```

## Quick Start

```typescript
import { BigcapitalAPI } from './bigcapital-api';

// Login with credentials
const api = await BigcapitalAPI.login('email@example.com', 'password');

// Or use existing JWT token
const api = new BigcapitalAPI('your-jwt-token');

// Fetch customers
const customers = await api.getCustomers();
console.log(customers.data);

// Create an invoice
const invoice = await api.createInvoice({
  customer_id: 1,
  invoice_date: '2025-01-14',
  due_date: '2025-02-14',
  invoice_no: 'INV-001',
  entries: [
    {
      description: 'Web Development',
      quantity: 1,
      rate: 1000
    }
  ]
});

// Create an expense
const expense = await api.createExpense({
  payment_date: '2025-01-14',
  payment_account_id: 1,
  vendor_id: 5,
  categories: [
    {
      index: 1,
      expense_account_id: 10,
      amount: 500,
      description: 'Office supplies'
    }
  ]
});
```

## Authentication

### Login with Credentials

```typescript
const api = await BigcapitalAPI.login(
  'email@example.com',
  'password',
  'https://your-bigcapital-url.com' // optional, defaults to fin2.syahril.dev
);
```

### Use Existing Token

```typescript
const api = new BigcapitalAPI(
  'your-jwt-token',
  'https://your-bigcapital-url.com' // optional
);
```

### Token Expiration

JWT tokens typically expire after 60 days. Handle token expiration:

```typescript
try {
  const data = await api.getInvoices();
} catch (error) {
  if (error.message.includes('401')) {
    // Token expired, re-login
    const newApi = await BigcapitalAPI.login(email, password);
    // Retry request
  }
}
```

## API Reference

### Customers

#### Get All Customers

```typescript
const customers = await api.getCustomers(page?: number, pageSize?: number);
// Returns: ApiResponse<Customer[]>

// Example
const firstPage = await api.getCustomers(1, 50);
console.log(firstPage.data); // Array of customers
console.log(firstPage.meta); // Pagination info
```

#### Get Single Customer

```typescript
const customer = await api.getCustomer(customerId: number);
// Returns: Customer

// Example
const customer = await api.getCustomer(123);
console.log(customer.display_name);
```

#### Create Customer

```typescript
const newCustomer = await api.createCustomer({
  display_name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  company_name: 'Acme Corp',
  billing_address: {
    address_line_1: '123 Main St',
    city: 'New York',
    country: 'US',
    zip_code: '10001'
  }
});
// Returns: Customer
```

#### Update Customer

```typescript
const updated = await api.updateCustomer(customerId, {
  email: 'newemail@example.com',
  phone: '+0987654321'
});
// Returns: Customer
```

### Items

#### Get All Items

```typescript
const items = await api.getItems(page?: number, pageSize?: number);
// Returns: ApiResponse<Item[]>
```

#### Get Single Item

```typescript
const item = await api.getItem(itemId: number);
// Returns: Item
```

#### Create Item

```typescript
const newItem = await api.createItem({
  name: 'Consulting Service',
  description: 'Hourly consulting',
  type: 'service',
  sell_price: 150,
  active: true
});
// Returns: Item
```

#### Update Item

```typescript
const updated = await api.updateItem(itemId, {
  sell_price: 175,
  description: 'Premium consulting service'
});
// Returns: Item
```

### Invoices

#### Get All Invoices

```typescript
const invoices = await api.getInvoices(page?: number, pageSize?: number);
// Returns: ApiResponse<Invoice[]>

// Example with pagination
for (let page = 1; page <= 5; page++) {
  const invoices = await api.getInvoices(page, 100);
  console.log(`Page ${page}:`, invoices.data.length);
}
```

#### Get Single Invoice

```typescript
const invoice = await api.getInvoice(invoiceId: number);
// Returns: Invoice
```

#### Create Invoice

```typescript
const invoice = await api.createInvoice({
  customer_id: 1,
  invoice_date: '2025-01-14',
  due_date: '2025-02-14',
  invoice_no: 'INV-2025-001',
  reference_no: 'PO-123',
  note: 'Thank you for your business!',
  terms_conditions: 'Net 30 days',
  entries: [
    {
      item_id: 5,
      description: 'Web Development Service',
      quantity: 10,
      rate: 150,
      discount: 10, // Optional discount
      tax_rate_id: 1 // Optional tax
    },
    {
      description: 'Custom feature development',
      quantity: 5,
      rate: 200
    }
  ],
  discount: 5, // Overall invoice discount
  discount_type: 'percentage',
  adjustment: -50 // Optional adjustment
});
// Returns: Invoice
```

#### Update Invoice

```typescript
const updated = await api.updateInvoice(invoiceId, {
  note: 'Updated note',
  due_date: '2025-03-01'
});
// Returns: Invoice
```

#### Delete Invoice

```typescript
await api.deleteInvoice(invoiceId);
// Returns: void
```

#### Mark as Delivered

```typescript
const delivered = await api.deliverInvoice(invoiceId);
// Returns: Invoice
```

#### Get Invoice PDF

```typescript
const pdfResponse = await api.getInvoicePdf(invoiceId);
const buffer = Buffer.from(await pdfResponse.arrayBuffer());

// Save to file
import { writeFileSync } from 'fs';
writeFileSync('invoice.pdf', buffer);
```

#### Send Invoice by Email

```typescript
await api.sendInvoice(invoiceId, {
  to: ['customer@example.com', 'accounts@example.com'],
  subject: 'Invoice from Acme Corp',
  message: 'Please find attached invoice for your recent purchase.'
});
```

### Expenses

#### Get All Expenses

```typescript
const expenses = await api.getExpenses(page?: number, pageSize?: number);
// Returns: ApiResponse<Expense[]>

// Example
const firstPage = await api.getExpenses(1, 50);
console.log(firstPage.data); // Array of expenses
console.log(firstPage.meta); // Pagination info
```

#### Get Single Expense

```typescript
const expense = await api.getExpense(expenseId: number);
// Returns: Expense

// Example
const expense = await api.getExpense(123);
console.log(expense.reference_no);
```

#### Create Expense

```typescript
const newExpense = await api.createExpense({
  payment_date: '2025-01-14',
  payment_account_id: 1,
  vendor_id: 5,
  reference_no: 'EXP-001',
  description: 'Monthly office supplies',
  categories: [
    {
      index: 1,
      expense_account_id: 10,
      amount: 500,
      description: 'Printer paper and ink',
      landed_cost: false,
      project_id: 2
    },
    {
      index: 2,
      expense_account_id: 11,
      amount: 200,
      description: 'Cleaning supplies'
    }
  ],
  publish: true // Publish immediately
});
// Returns: Expense
```

#### Update Expense

```typescript
const updated = await api.updateExpense(expenseId, {
  description: 'Updated expense description',
  categories: [
    {
      index: 1,
      expense_account_id: 10,
      amount: 550,
      description: 'Updated amount'
    }
  ]
});
// Returns: Expense
```

#### Delete Expense

```typescript
await api.deleteExpense(expenseId);
// Returns: void
```

#### Publish Expense

```typescript
// Publish (finalize) an expense that was created as draft
const published = await api.publishExpense(expenseId);
// Returns: Expense
```

### Utility Methods

#### Get Current User

```typescript
const user = await api.getMe();
console.log(user.email, user.full_name);
```

#### Get Organization Info

```typescript
const org = await api.getOrganization();
console.log(org.name, org.base_currency);
```

#### Get Chart of Accounts

```typescript
const accounts = await api.getAccounts();
// Useful for setting sell_account_id, cost_account_id
```

#### Get Tax Rates

```typescript
const taxRates = await api.getTaxRates();
// Use for tax_rate_id in invoice entries
```

## Types

### Customer

```typescript
interface Customer {
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
```

### Item

```typescript
interface Item {
  id: number;
  name: string;
  description?: string;
  type: 'service' | 'product';
  sell_price?: number;
  sell_account_id?: number;
  cost_price?: number;
  cost_account_id?: number;
  quantity_on_hand?: number;
  active: boolean;
}
```

### Invoice

```typescript
interface Invoice {
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
  discount_type?: 'percentage' | 'amount';
  adjustment?: number;
  message?: string;
  statement?: string;
}
```

### Expense

```typescript
interface Expense {
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
```

### ExpenseCategory

```typescript
interface ExpenseCategory {
  index: number;
  expense_account_id: number;
  amount?: number;
  description?: string;
  landed_cost?: boolean;
  project_id?: number;
}
```

### InvoiceEntry

```typescript
interface InvoiceEntry {
  item_id?: number;
  description: string;
  quantity: number;
  rate: number;
  total?: number; // Auto-calculated
  discount?: number;
  tax_rate_id?: number;
}
```

### ApiResponse

```typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    page_size: number;
  };
}
```

## Error Handling

The library throws errors with descriptive messages:

```typescript
try {
  const invoice = await api.createInvoice(invoiceData);
} catch (error) {
  if (error.message.includes('401')) {
    console.error('Authentication failed - token may be expired');
  } else if (error.message.includes('422')) {
    console.error('Validation error - check your data');
  } else if (error.message.includes('404')) {
    console.error('Resource not found');
  } else {
    console.error('API Error:', error.message);
  }
}
```

## Examples

### Complete Invoice Generation Workflow

```typescript
import { BigcapitalAPI, Invoice, Expense } from './bigcapital-api';
import { writeFileSync } from 'fs';

async function generateMonthlyInvoices() {
  // Login
  const api = await BigcapitalAPI.login(
    process.env.BIGCAPITAL_EMAIL!,
    process.env.BIGCAPITAL_PASSWORD!
  );

  // Get all active customers
  const customers = await api.getCustomers();
  const activeCustomers = customers.data.filter(c => c.active);

  // Get service items
  const items = await api.getItems();
  const serviceItem = items.data.find(i => i.name === 'Monthly Service');

  if (!serviceItem) {
    throw new Error('Service item not found');
  }

  // Generate invoices for each customer
  const invoices = [];
  for (const customer of activeCustomers) {
    const invoice = await api.createInvoice({
      customer_id: customer.id,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      invoice_no: `INV-${Date.now()}-${customer.id}`,
      note: 'Thank you for your continued business!',
      entries: [
        {
          item_id: serviceItem.id,
          description: serviceItem.description || 'Monthly subscription',
          quantity: 1,
          rate: serviceItem.sell_price || 100
        }
      ]
    });

    invoices.push(invoice);
    console.log(`Created invoice ${invoice.invoice_no} for ${customer.display_name}`);

    // Send email
    await api.sendInvoice(invoice.id!, {
      to: [customer.email!],
      subject: `Invoice ${invoice.invoice_no}`,
      message: 'Please find your monthly invoice attached.'
    });

    // Download PDF
    const pdfResponse = await api.getInvoicePdf(invoice.id!);
    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
    writeFileSync(`invoices/${invoice.invoice_no}.pdf`, pdfBuffer);
  }

  return invoices;
}
```

### Track Business Expenses

```typescript
async function trackMonthlyExpenses() {
  const api = await BigcapitalAPI.login(email, password);

  // Get all vendors
  const vendors = await api.getCustomers(); // Vendors use same endpoint
  const officeSuppliesVendor = vendors.data.find(v =>
    v.display_name === 'Office Supplies Inc'
  );

  // Get expense accounts
  const accounts = await api.getAccounts();
  const officeExpenseAccount = accounts.find(a =>
    a.name === 'Office Expenses'
  );

  // Create expense with multiple categories
  const expense = await api.createExpense({
    payment_date: new Date().toISOString().split('T')[0],
    payment_account_id: 1, // Cash account
    vendor_id: officeSuppliesVendor?.id,
    reference_no: `EXP-${Date.now()}`,
    description: 'Monthly office supplies purchase',
    categories: [
      {
        index: 1,
        expense_account_id: officeExpenseAccount.id,
        amount: 250.00,
        description: 'Printer supplies'
      },
      {
        index: 2,
        expense_account_id: officeExpenseAccount.id,
        amount: 150.00,
        description: 'Stationery'
      },
      {
        index: 3,
        expense_account_id: officeExpenseAccount.id,
        amount: 75.00,
        description: 'Kitchen supplies'
      }
    ],
    publish: true // Immediately publish the expense
  });

  console.log(`Created expense ${expense.reference_no} for $${expense.total_amount}`);
  return expense;
}
```

### Bulk Import Items

```typescript
async function importItems(csvData: any[]) {
  const api = await BigcapitalAPI.login(email, password);
  
  const imported = [];
  for (const row of csvData) {
    try {
      const item = await api.createItem({
        name: row.name,
        description: row.description,
        type: row.type as 'service' | 'product',
        sell_price: parseFloat(row.price),
        active: true
      });
      imported.push(item);
      console.log(`Imported: ${item.name}`);
    } catch (error) {
      console.error(`Failed to import ${row.name}:`, error.message);
    }
  }
  
  return imported;
}
```

### Custom Invoice Report

```typescript
async function generateInvoiceReport(startDate: string, endDate: string) {
  const api = await BigcapitalAPI.login(email, password);
  
  // Fetch all invoices (handling pagination)
  const allInvoices = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await api.getInvoices(page, 100);
    allInvoices.push(...response.data);
    
    if (response.data.length < 100) {
      hasMore = false;
    }
    page++;
  }
  
  // Filter by date range
  const filtered = allInvoices.filter(inv => {
    return inv.invoice_date >= startDate && inv.invoice_date <= endDate;
  });
  
  // Calculate totals
  const summary = {
    total_invoices: filtered.length,
    total_amount: filtered.reduce((sum, inv) => {
      const total = inv.entries.reduce((s, e) => s + (e.total || e.quantity * e.rate), 0);
      return sum + total;
    }, 0),
    by_customer: {} as Record<number, number>
  };
  
  // Group by customer
  for (const invoice of filtered) {
    if (!summary.by_customer[invoice.customer_id]) {
      summary.by_customer[invoice.customer_id] = 0;
    }
    const total = invoice.entries.reduce((s, e) => s + (e.total || e.quantity * e.rate), 0);
    summary.by_customer[invoice.customer_id] += total;
  }
  
  return summary;
}
```

## Best Practices

### 1. Environment Variables

Store credentials securely:

```typescript
// .env file
BIGCAPITAL_EMAIL=your-email@example.com
BIGCAPITAL_PASSWORD=your-password
BIGCAPITAL_API_URL=https://your-instance.com

// Usage
const api = await BigcapitalAPI.login(
  process.env.BIGCAPITAL_EMAIL!,
  process.env.BIGCAPITAL_PASSWORD!,
  process.env.BIGCAPITAL_API_URL
);
```

### 2. Token Management

Cache and reuse tokens:

```typescript
class TokenManager {
  private static token?: string;
  private static expiry?: Date;
  
  static async getApi(): Promise<BigcapitalAPI> {
    if (this.token && this.expiry && this.expiry > new Date()) {
      return new BigcapitalAPI(this.token);
    }
    
    const api = await BigcapitalAPI.login(
      process.env.BIGCAPITAL_EMAIL!,
      process.env.BIGCAPITAL_PASSWORD!
    );
    
    this.token = api['token']; // Store for reuse
    this.expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    return api;
  }
}
```

### 3. Rate Limiting

Implement rate limiting for bulk operations:

```typescript
async function rateLimited<T>(
  items: T[],
  operation: (item: T) => Promise<any>,
  delayMs = 100
) {
  const results = [];
  for (const item of items) {
    results.push(await operation(item));
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  return results;
}

// Usage
const customers = [...]; // Array of customer data
const created = await rateLimited(customers, 
  customer => api.createCustomer(customer),
  200 // 200ms delay between requests
);
```

### 4. Error Recovery

Implement retry logic:

```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const invoice = await withRetry(
  () => api.createInvoice(invoiceData),
  3,
  2000
);
```

### 5. Validation

Validate data before API calls:

```typescript
function validateInvoice(invoice: Partial<Invoice>): void {
  if (!invoice.customer_id) {
    throw new Error('customer_id is required');
  }
  if (!invoice.invoice_date) {
    throw new Error('invoice_date is required');
  }
  if (!invoice.entries || invoice.entries.length === 0) {
    throw new Error('At least one entry is required');
  }
  // Add more validation as needed
}

// Usage
validateInvoice(invoiceData);
const invoice = await api.createInvoice(invoiceData as Invoice);
```

## Support

For issues or questions about:
- **This library**: Create an issue in your project repository
- **Bigcapital API**: Check the [Bigcapital documentation](https://docs.bigcapital.ly)
- **Authentication issues**: Ensure your credentials are correct and your account has API access

## License

This library is provided as-is for use with Bigcapital accounting software.