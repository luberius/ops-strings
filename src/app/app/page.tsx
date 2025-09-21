import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { DollarSign, Receipt, Users, ShoppingCart, Package, Calculator } from "lucide-react";

export default function Page() {
  const quickActions = [
    {
      title: "New Invoice",
      description: "Create and send invoices",
      href: "/invoices/new",
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Add Expense",
      description: "Record expenses",
      href: "/expenses/new",
      icon: Receipt,
      color: "bg-purple-500",
    },
    {
      title: "New Customer",
      description: "Add new customer",
      href: "/customers/new",
      icon: Users,
      color: "bg-green-500",
    },
  ];

  const overviewCards = [
    {
      title: "Invoices",
      description: "Manage all invoices",
      href: "/invoices",
      icon: ShoppingCart,
      stats: "View all",
    },
    {
      title: "Items",
      description: "Products & services",
      href: "/items",
      icon: Package,
      stats: "Manage",
    },
    {
      title: "Accounts",
      description: "Chart of accounts",
      href: "/accounts",
      icon: Calculator,
      stats: "Overview",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/app">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {action.description}
                      </p>
                      <p className="text-2xl font-bold">{action.title}</p>
                    </div>
                    <div className={`rounded-lg p-3 ${action.color} bg-opacity-10`}>
                      <Icon className={`h-6 w-6 ${action.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {overviewCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="rounded-xl border bg-card p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                    <span className="text-sm text-primary">{card.stats}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <p className="text-muted-foreground">No recent activity to display</p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
