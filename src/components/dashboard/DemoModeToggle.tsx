import { Play, Pause, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useSystem } from '@/context/SystemContext';

export const DemoModeToggle = () => {
  const { state, toggleDemoMode } = useSystem();
  const { demoMode } = state;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDemoMode}
          className={cn(
            "gap-2 transition-all",
            demoMode
              ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
              : "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
          )}
        >
          {demoMode ? (
            <>
              <Pause className="h-4 w-4" />
              <span className="hidden sm:inline">Demo Active</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Demo Mode</span>
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">
          {demoMode
            ? 'Click to disable demo mode'
            : 'Enable demo mode to simulate actions'}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

interface SimulateButtonProps {
  boxId: string;
  disabled?: boolean;
}

export const SimulateButton = ({ boxId, disabled }: SimulateButtonProps) => {
  const { state, simulateAction } = useSystem();
  const { demoMode } = state;

  if (!demoMode) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        simulateAction(boxId);
      }}
      disabled={disabled}
      className="absolute top-2 left-2 h-6 px-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs gap-1"
    >
      <Zap className="h-3 w-3" />
      Simulate
    </Button>
  );
};

export const DemoModeBadge = () => {
  const { state } = useSystem();
  const { demoMode } = state;

  if (!demoMode) return null;

  return (
    <Badge
      variant="outline"
      className="bg-primary/10 text-primary border-primary/20 animate-pulse"
    >
      <Zap className="h-3 w-3 mr-1" />
      Demo Mode Active
    </Badge>
  );
};
