import { QuickActions } from "./partials/quick-actions";
import { OverviewCards } from "./partials/overview-cards";
import { RecentActivity } from "./partials/recent-activity";
import { Flash, KeyframeAlignCenter } from "iconoir-react";

export default function Page() {
  return (
    <>
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
    </>
  );
}
