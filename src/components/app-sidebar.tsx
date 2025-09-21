"use client";

import {
  Building2,
  Calculator,
  DollarSign,
  Receipt,
  Settings2,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@company.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Main Company",
      logo: Building2,
      plan: "Enterprise",
    },
    {
      name: "Subsidiary Co.",
      logo: TrendingUp,
      plan: "Professional",
    },
    {
      name: "Demo Tenant",
      logo: Calculator,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Sales",
      url: "#",
      icon: ShoppingCart,
      isActive: true,
      items: [
        {
          title: "Invoices",
          url: "/invoices",
        },
        {
          title: "Customers",
          url: "/customers",
        },
        {
          title: "Items",
          url: "/items",
        },
      ],
    },
    {
      title: "Expenses",
      url: "#",
      icon: Receipt,
      items: [
        {
          title: "All Expenses",
          url: "/expenses",
        },
      ],
    },
    {
      title: "Accounting",
      url: "#",
      icon: Calculator,
      items: [
        {
          title: "Accounts",
          url: "/accounts",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Organization",
          url: "/settings/organization",
        },
        {
          title: "Tax Rates",
          url: "/settings/tax-rates",
        },
      ],
    },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
