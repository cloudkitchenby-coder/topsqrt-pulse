import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const variantStyles = {
  default: "bg-gray-100 text-gray-700 border-gray-200",
  success: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  error: "bg-red-100 text-red-700 border-red-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
};

export const StatusBadge = ({ status, variant = 'default' }: StatusBadgeProps) => {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border",
      variantStyles[variant]
    )}>
      {status}
    </span>
  );
};

// Auto-detect variant based on status text
export const AutoStatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.toLowerCase();
  
  let variant: StatusBadgeProps['variant'] = 'default';
  
  if (['active', 'completed', 'done', 'success', 'paid'].includes(normalizedStatus)) {
    variant = 'success';
  } else if (['pending', 'processing', 'in-progress', 'break'].includes(normalizedStatus)) {
    variant = 'warning';
  } else if (['inactive', 'failed', 'error', 'cancelled', 'offline', 'disputed'].includes(normalizedStatus)) {
    variant = 'error';
  } else if (['new', 'info', 'scheduled'].includes(normalizedStatus)) {
    variant = 'info';
  }

  return <StatusBadge status={status} variant={variant} />;
};
