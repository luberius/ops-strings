"use client";

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
import { usePathname } from "next/navigation";
import React from "react";

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1 && segments[0] === "app") {
    return [
      { label: "Dashboard", href: "/app", isPage: false },
      { label: "Overview", isPage: true },
    ];
  }

  const breadcrumbs = [
    { label: "Dashboard", href: "/app", isPage: false },
  ];

  let currentPath = "";
  segments.slice(1).forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.slice(1).length - 1;

    const label = segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (isLast) {
      breadcrumbs.push({ label, isPage: true });
    } else {
      breadcrumbs.push({ label, href: `/app${currentPath}`, isPage: false });
    }
  });

  return breadcrumbs;
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

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
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                      {crumb.isPage ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}