import Link from "next/link";
import { FlameKindling, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";

const overviewCards = [
  {
    title: "Invoices",
    description: "Manage all invoices",
    href: "/invoices",
    icon: ScrollText,
    stats: "View all",
  },
  {
    title: "Expenses",
    description: "Track all expenses",
    href: "/expenses",
    icon: FlameKindling,
    stats: "Overview",
  },
];

export function OverviewCards() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {overviewCards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <h3 className="font-semibold">{card.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <Button size="sm" variant="outline">
                {card.stats}
              </Button>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
