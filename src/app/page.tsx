import Link from "next/link";
import {
  DollarSign,
  Receipt,
  Users,
  ShoppingCart,
  Package,
  Calculator,
} from "lucide-react";

export default function Home() {
  const quickActions = [
    {
      title: "New Invoice",
      description: "Create and send invoices to customers",
      href: "/invoices/new",
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Add Expense",
      description: "Record business expenses",
      href: "/app/expenses",
      icon: Receipt,
      color: "bg-purple-500",
    },
    {
      title: "New Customer",
      description: "Add a new customer to your database",
      href: "/customers/new",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "View Invoices",
      description: "Manage all your invoices",
      href: "/invoices",
      icon: ShoppingCart,
      color: "bg-orange-500",
    },
    {
      title: "Manage Items",
      description: "Products and services catalog",
      href: "/items",
      icon: Package,
      color: "bg-pink-500",
    },
    {
      title: "Accounts",
      description: "Chart of accounts overview",
      href: "/accounts",
      icon: Calculator,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Ops Strings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your business finances with ease
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg ${action.color} bg-opacity-10`}
                  >
                    <Icon
                      className={`h-6 w-6 ${action.color.replace("bg-", "text-")}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/app"
            className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
