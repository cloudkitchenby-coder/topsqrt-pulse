import { forwardRef, useState, useEffect } from "react";
import { 
  CreditCard, 
  Phone, 
  FileText, 
  AlertCircle, 
  UserX, 
  Receipt, 
  Eye,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardBoxData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface DashboardBoxProps {
  box: DashboardBoxData;
  onClick: () => void;
}

const categoryConfig = {
  payment: {
    bgClass: "bg-payment-light",
    iconClass: "text-payment",
    borderClass: "border-payment/30",
    hoverClass: "hover:border-payment/50",
  },
  trial: {
    bgClass: "bg-trial-light",
    iconClass: "text-trial",
    borderClass: "border-trial/30",
    hoverClass: "hover:border-trial/50",
  },
  gst: {
    bgClass: "bg-gst-light",
    iconClass: "text-gst",
    borderClass: "border-gst/30",
    hoverClass: "hover:border-gst/50",
  },
  complaint: {
    bgClass: "bg-complaint-light",
    iconClass: "text-complaint",
    borderClass: "border-complaint/30",
    hoverClass: "hover:border-complaint/50",
  },
  unsubscriber: {
    bgClass: "bg-unsubscriber-light",
    iconClass: "text-unsubscriber",
    borderClass: "border-unsubscriber/30",
    hoverClass: "hover:border-unsubscriber/50",
  },
  bill: {
    bgClass: "bg-bill-light",
    iconClass: "text-bill",
    borderClass: "border-bill/30",
    hoverClass: "hover:border-bill/50",
  },
};

const getIcon = (category: string, type: string) => {
  if (type === 'call') return Phone;
  if (type === 'bill') {
    if (category === 'bill') return Receipt;
    return FileText;
  }
  switch (category) {
    case 'payment': return CreditCard;
    case 'trial': return Eye;
    case 'gst': return FileText;
    case 'complaint': return AlertCircle;
    case 'unsubscriber': return UserX;
    default: return MessageSquare;
  }
};

export const DashboardBox = forwardRef<HTMLDivElement, DashboardBoxProps>(
  ({ box, onClick }, ref) => {
    const [animating, setAnimating] = useState(false);
    const [prevCount, setPrevCount] = useState(box.count);
    const config = categoryConfig[box.category];
    const Icon = getIcon(box.category, box.type);

    useEffect(() => {
      if (box.count !== prevCount) {
        setAnimating(true);
        const timer = setTimeout(() => setAnimating(false), 300);
        setPrevCount(box.count);
        return () => clearTimeout(timer);
      }
    }, [box.count, prevCount]);

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "relative bg-card rounded-xl p-4 border-2 cursor-pointer transition-all duration-200",
          "shadow-card hover:shadow-card-hover hover:-translate-y-1",
          config.borderClass,
          config.hoverClass
        )}
      >
        <div className="flex items-start justify-between">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            config.bgClass
          )}>
            <Icon className={cn("h-6 w-6", config.iconClass)} />
          </div>

          <div className="text-right">
            {box.count !== null ? (
              <div className={cn(
                "text-3xl font-bold text-foreground",
                animating && "animate-count"
              )}>
                {box.count}
              </div>
            ) : box.showTotal ? (
              <div className="text-sm font-medium text-muted-foreground">Total</div>
            ) : box.showView ? (
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            ) : (
              <div className="text-2xl text-muted-foreground/50">—</div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <h3 className="font-semibold text-foreground">{box.label}</h3>
          <p className="text-xs text-muted-foreground capitalize">{box.type}</p>
        </div>

        {box.count !== null && box.count > 0 && (
          <div className={cn(
            "absolute top-2 right-2 w-2 h-2 rounded-full",
            box.category === 'complaint' ? 'bg-complaint animate-pulse' : 'bg-primary/50'
          )} />
        )}
      </div>
    );
  }
);

DashboardBox.displayName = "DashboardBox";
