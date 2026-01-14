import { Shield, ShieldAlert, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useSystem } from '@/context/SystemContext';
import { format } from 'date-fns';

export const SystemHealthBadge = () => {
  const { state, runHealthCheck } = useSystem();
  const { systemHealth, lastHealthCheck } = state;

  const getHealthConfig = () => {
    switch (systemHealth) {
      case 'healthy':
        return {
          icon: Shield,
          label: 'All Clients Tracked',
          className: 'bg-green-500/10 text-green-600 border-green-500/20',
          iconClass: 'text-green-500',
        };
      case 'syncing':
        return {
          icon: Loader2,
          label: 'Sync in Progress',
          className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          iconClass: 'text-amber-500 animate-spin',
        };
      case 'attention-needed':
        return {
          icon: ShieldAlert,
          label: 'Attention Needed',
          className: 'bg-red-500/10 text-red-600 border-red-500/20',
          iconClass: 'text-red-500',
        };
      default:
        return {
          icon: Shield,
          label: 'Unknown',
          className: 'bg-muted text-muted-foreground',
          iconClass: 'text-muted-foreground',
        };
    }
  };

  const config = getHealthConfig();
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "cursor-pointer gap-1.5 px-2.5 py-1 font-normal transition-colors",
            config.className
          )}
          onClick={() => runHealthCheck()}
        >
          <Icon className={cn("h-3.5 w-3.5", config.iconClass)} />
          <span className="hidden sm:inline text-xs">{config.label}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs">
          <p className="font-medium">{config.label}</p>
          <p className="text-muted-foreground">
            Last check: {format(lastHealthCheck, 'h:mm:ss a')}
          </p>
          <p className="text-muted-foreground mt-1">
            Click to run health check
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
