import { useState } from 'react';
import { format } from 'date-fns';
import { Activity, ChevronDown, ChevronUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSystem } from '@/context/SystemContext';
import { getBoxDisplayName } from '@/lib/autoUpdateEngine';

export const ActivityLog = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getRecentActivity } = useSystem();
  const activities = getRecentActivity(15);

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'done':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'follow-up':
        return <Clock className="h-3 w-3 text-amber-500" />;
      case 'pending':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getResultBadgeVariant = (result: string) => {
    switch (result) {
      case 'done':
        return 'default';
      case 'follow-up':
        return 'secondary';
      case 'pending':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (activities.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "fixed right-4 bottom-4 bg-card border border-border rounded-xl shadow-lg transition-all duration-300 z-50",
      isExpanded ? "w-80 h-96" : "w-auto h-auto"
    )}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 rounded-t-xl"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Recent Activity</span>
          <Badge variant="secondary" className="text-xs">
            {activities.length}
          </Badge>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </Button>

      {isExpanded && (
        <ScrollArea className="h-80 px-3 pb-3">
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-2 bg-muted/50 rounded-lg text-xs animate-fade-in"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {getResultIcon(activity.result)}
                    <span className="font-medium text-foreground">
                      {activity.clientName}
                    </span>
                  </div>
                  <Badge
                    variant={getResultBadgeVariant(activity.result) as "default" | "secondary" | "destructive" | "outline"}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {activity.result}
                  </Badge>
                </div>
                
                <div className="mt-1 text-muted-foreground">
                  {activity.fromBox !== activity.toBox ? (
                    <span>
                      {getBoxDisplayName(activity.fromBox || '')} → {getBoxDisplayName(activity.toBox || '')}
                    </span>
                  ) : (
                    <span>{getBoxDisplayName(activity.fromBox || '')}</span>
                  )}
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <span className="text-muted-foreground/70">
                    {activity.userName}
                  </span>
                  <span className="text-muted-foreground/70">
                    {format(activity.timestamp, 'h:mm a')}
                  </span>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
