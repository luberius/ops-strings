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
import { QuickActions } from "./partials/quick-actions";
import { OverviewCards } from "./partials/overview-cards";
import { RecentActivity } from "./partials/recent-activity";
import { Flash, KeyframeAlignCenter } from "iconoir-react";

export default function Page() {
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
                  <BreadcrumbLink href="/app">Dashboard</BreadcrumbLink>
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
          <div className="flex gap-2 items-center">
            <Flash className="text-xs text-black/50" />
            <span className="text-xs tracking-widest font-semibold uppercase text-black/50">
              Quick Actions
            </span>
          </div>
          <QuickActions />
          <div className="flex gap-2 items-center">
            <KeyframeAlignCenter className="text-xs text-black/50" />
            <span className="text-xs tracking-widest font-semibold uppercase text-black/50">
              Overview
            </span>
          </div>
          <OverviewCards />
          <RecentActivity />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
