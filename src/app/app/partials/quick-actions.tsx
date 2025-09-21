import { Flash } from "iconoir-react";
import Link from "next/link";

const quickActions = [
  {
    title: "New Invoice",
    description: "Create and send invoices",
    href: "/invoices/new",
  },
  {
    title: "Add Expense",
    description: "Record expenses",
    href: "/expenses/new",
  },
  {
    title: "New Customer",
    description: "Add new customer",
    href: "/customers/new",
  },
];

export function QuickActions() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {quickActions.map((action) => {
        return (
          <Link
            key={action.href}
            href={action.href}
            className="group relative overflow-hidden rounded-md border bg-card p-4 hover:shadow-md transition-all py-2"
          >
            <div className="flex items-center gap-4">
              <Flash className="text-yellow-500 animate-pulse" />
              <div>
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs font-medium text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
