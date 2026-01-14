import { TrendingUp, TrendingDown, IndianRupee, Calendar } from "lucide-react";
import { useSystem } from "@/context/SystemContext";
import { formatCurrency } from "@/lib/autoUpdateEngine";
import { DemoModeBadge } from "./DemoModeToggle";

export const MetricsBar = () => {
  const { state } = useSystem();
  const { pendingSummary } = state;

  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm text-muted-foreground">Current Pending:</span>
              <span className="font-bold text-foreground">
                {formatCurrency(pendingSummary.currentPending)}
              </span>
            </div>

            <div className="h-4 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Previous Pending:</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(pendingSummary.previousPending)}
              </span>
            </div>

            <div className="h-4 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Today Collection:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(pendingSummary.todayCollection.amount)}
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {pendingSummary.todayCollection.count} transactions
              </span>
            </div>

            <div className="h-4 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Follow-ups:</span>
              <span className="font-semibold text-foreground">
                {pendingSummary.followUpsCompleted}/{pendingSummary.followUpsTotal}
              </span>
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(pendingSummary.followUpsCompleted / pendingSummary.followUpsTotal) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          <DemoModeBadge />
        </div>
      </div>
    </div>
  );
};