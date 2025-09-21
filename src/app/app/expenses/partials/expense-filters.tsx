"use client";

import { useSnapshot } from "valtio";
import { expenseStore, expenseActions } from "../store";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ExpenseFilters() {
  const snap = useSnapshot(expenseStore);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const handleSearch = (value: string) => {
    expenseActions.updateFilters({ search: value });
  };

  const handleStatusChange = (value: string) => {
    expenseActions.updateFilters({
      status: value as "published" | "draft" | "all",
    });
  };

  const handleVendorChange = (value: string) => {
    expenseActions.updateFilters({
      vendorId: value === "all" ? undefined : parseInt(value),
    });
  };

  const handleDateFilter = () => {
    expenseActions.updateFilters({
      dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
      dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
    });
  };

  const clearFilters = () => {
    expenseActions.updateFilters({
      search: "",
      status: "all",
      vendorId: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    });
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters =
    snap.filters.search ||
    snap.filters.status !== "all" ||
    snap.filters.vendorId ||
    snap.filters.dateFrom ||
    snap.filters.dateTo;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={snap.filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={snap.filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={snap.filters.vendorId?.toString() || "all"}
          onValueChange={handleVendorChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Vendors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            {(snap.vendors || []).map((vendor) => (
              <SelectItem key={vendor.id} value={vendor.id.toString()}>
                {vendor.display_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "PP") : "From date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={setDateFrom}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "PP") : "To date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={setDateTo}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(dateFrom || dateTo) && (
          <Button onClick={handleDateFilter} variant="secondary">
            Apply Date Filter
          </Button>
        )}

        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {snap.filters.search && (
            <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
              Search: {snap.filters.search}
            </div>
          )}
          {snap.filters.status !== "all" && (
            <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
              Status: {snap.filters.status}
            </div>
          )}
          {snap.filters.vendorId && (
            <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
              Vendor: {(snap.vendors || []).find((v) => v.id === snap.filters.vendorId)?.display_name}
            </div>
          )}
          {snap.filters.dateFrom && (
            <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
              From: {snap.filters.dateFrom}
            </div>
          )}
          {snap.filters.dateTo && (
            <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
              To: {snap.filters.dateTo}
            </div>
          )}
        </div>
      )}
    </div>
  );
}