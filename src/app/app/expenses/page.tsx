import { Receipt, AlertCircle } from "lucide-react";
import { getExpenses, getVendors, getAccounts } from "./actions";
import { ExpenseList } from "./partials/expense-list";
import { ExpenseFilters } from "./partials/expense-filters";
import { ExpenseActions } from "./partials/expense-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ExpensesPage() {
  try {
    const [expensesRes, vendorsRes, accountsRes] = await Promise.all([
      getExpenses(1, 50),
      getVendors(1, 100),
      getAccounts(),
    ]);

    // Initialize store data directly on server
    const props = {
      expenses: expensesRes.expenses || [],
      vendors: vendorsRes.vendors || [],
      accounts: accountsRes.accounts || [],
      pagination: {
        page: 1,
        pageSize: 50,
        total: expensesRes.pagination?.total || 0,
      },
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Receipt className="text-xs text-black/50" />
            <span className="text-xs tracking-widest font-semibold uppercase text-black/50">
              Expense Management
            </span>
          </div>
          <ExpenseActions />
        </div>

        <ExpenseFilters />
        <ExpenseList initialData={props} />
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 items-center">
          <Receipt className="text-xs text-black/50" />
          <span className="text-xs tracking-widest font-semibold uppercase text-black/50">
            Expense Management
          </span>
        </div>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">API Configuration Required</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              To use the expense management feature, you need to configure your Bigcapital API credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-orange-900">
                Please add the following to your <code className="bg-orange-100 px-1 py-0.5 rounded">.env.local</code> file:
              </p>
              <pre className="bg-orange-100 p-4 rounded-lg text-xs overflow-x-auto">
{`# Option 1: Use an existing JWT token
BIGCAPITAL_TOKEN=your_jwt_token_here

# Option 2: Use email and password for auto-login
BIGCAPITAL_EMAIL=your_email@example.com
BIGCAPITAL_PASSWORD=your_password_here

# Optional: Change the API URL if needed
BIGCAPITAL_API_URL=https://fin2.syahril.dev`}
              </pre>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-orange-800">
                <strong>To get your JWT token:</strong>
              </p>
              <ol className="list-decimal list-inside text-sm text-orange-700 space-y-1">
                <li>Login to your Bigcapital account</li>
                <li>Open browser developer tools (F12)</li>
                <li>Go to Network tab</li>
                <li>Look for any API request and check the Authorization header</li>
                <li>Copy the token after "Bearer "</li>
              </ol>
            </div>

            {error instanceof Error && (
              <div className="text-xs text-orange-600 bg-orange-100 p-2 rounded">
                Error: {error.message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }