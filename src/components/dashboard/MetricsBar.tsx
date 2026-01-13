import { TrendingUp, TrendingDown, IndianRupee, Calendar } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const MetricCard = ({ label, value, subValue, icon, trend, className = "" }: MetricCardProps) => (
  <div className={`bg-card rounded-xl p-4 shadow-card flex items-center gap-4 ${className}`}>
    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-muted-foreground truncate">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-xl font-bold text-foreground">{value}</p>
        {subValue && (
          <span className="text-sm text-muted-foreground">{subValue}</span>
        )}
      </div>
    </div>
    {trend && trend !== 'neutral' && (
      <div className={`flex-shrink-0 ${trend === 'up' ? 'text-emerald-500' : 'text-destructive'}`}>
        {trend === 'up' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
      </div>
    )}
  </div>
);

export const MetricsBar = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Previous Pending"
          value="₹15,500"
          icon={<IndianRupee className="h-6 w-6" />}
          trend="down"
        />
        <MetricCard
          label="Current Pending"
          value="₹2,00,000"
          icon={<IndianRupee className="h-6 w-6" />}
          trend="neutral"
        />
        <MetricCard
          label="Today Collection"
          value="₹12,500"
          subValue="(3 payments)"
          icon={<Calendar className="h-6 w-6" />}
          trend="up"
        />
      </div>
    </div>
  );
};
