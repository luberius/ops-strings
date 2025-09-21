"use client";

import { Building2, Calculator, Receipt, ShoppingCart } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavSettings } from "./nav-settings";

const data = {
  user: {
    name: "Admin User",
    email: "admin@company.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Syahril Pratama Solution",
      logo: Building2,
      plan: "Enterprise",
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
        <NavSettings projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
