import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Users, 
  DollarSign, 
  BellOff, 
  Lock, 
  FileText, 
  BarChart3, 
  Eye, 
  LogOut, 
  Settings, 
  ChevronDown,
  ChevronRight,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  count?: number;
  countColor?: string;
  submenu?: { id: string; label: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <Home size={20} />, path: "/" },
  { id: "clients", label: "Clients", icon: <Users size={20} />, path: "/clients", count: 500, countColor: "bg-blue-500" },
  { id: "payments", label: "Payments", icon: <DollarSign size={20} />, path: "/payments" },
  { id: "unsubscriber", label: "Unsubscriber", icon: <BellOff size={20} />, path: "/unsubscriber", count: 30, countColor: "bg-orange-500" },
  { id: "closed-units", label: "Closed Units", icon: <Lock size={20} />, path: "/closed-units", count: 5, countColor: "bg-red-500" },
  { id: "stamp-register", label: "Stamp Register", icon: <FileText size={20} />, path: "/stamp-register", count: 300, countColor: "bg-gray-500" },
  { 
    id: "reporting", 
    label: "Reporting", 
    icon: <BarChart3 size={20} />, 
    count: 480, 
    countColor: "bg-purple-500",
    submenu: [
      { id: "daily-activity", label: "Daily Activity Report", path: "/reports/daily-activity" },
      { id: "monthly-performance", label: "Monthly Performance", path: "/reports/monthly-performance" },
      { id: "officer-wise", label: "Officer Wise Report", path: "/reports/officer-wise" },
      { id: "area-wise", label: "Area Wise Report", path: "/reports/area-wise" },
      { id: "payment-collection", label: "Payment Collection", path: "/reports/payment-collection" },
      { id: "visit-completion", label: "Visit Completion", path: "/reports/visit-completion" },
      { id: "followup-pending", label: "Follow-up Pending", path: "/reports/followup-pending" },
    ]
  },
  { id: "live-monitoring", label: "Live Monitoring", icon: <Eye size={20} />, path: "/live-monitoring", count: 30, countColor: "bg-green-500" },
];

const bottomMenuItems: MenuItem[] = [
  { id: "configuration", label: "Configuration", icon: <Settings size={20} />, path: "/configuration" },
  { id: "logout", label: "Logout", icon: <LogOut size={20} /> },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const toggleSubmenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.id === "logout") {
      setShowLogoutDialog(true);
      return;
    }
    
    if (item.submenu) {
      toggleSubmenu(item.id);
    } else if (item.path) {
      navigate(item.path);
      onClose();
    }
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const renderMenuItem = (item: MenuItem, isBottom = false) => {
    const active = isActive(item.path);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus.includes(item.id);

    return (
      <div key={item.id}>
        <button
          onClick={() => handleMenuClick(item)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-2",
            "hover:bg-primary/10",
            active && "bg-primary text-primary-foreground shadow-md",
            !active && "text-foreground/80 hover:text-foreground"
          )}
          style={{ width: "calc(100% - 16px)" }}
        >
          <span className={cn("transition-colors", active && "text-primary-foreground")}>
            {item.icon}
          </span>
          <span className="flex-1 text-left">{item.label}</span>
          {item.count && (
            <span className={cn(
              "px-2 py-0.5 text-xs font-semibold rounded-full text-white",
              item.countColor || "bg-gray-500"
            )}>
              {item.count}
            </span>
          )}
          {hasSubmenu && (
            <span className="transition-transform duration-200">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>

        {hasSubmenu && isExpanded && (
          <div className="ml-8 mt-1 space-y-1 animate-fade-in">
            {item.submenu?.map(subItem => (
              <button
                key={subItem.id}
                onClick={() => {
                  navigate(subItem.path);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200 rounded-md mx-2",
                  "hover:bg-primary/10",
                  isActive(subItem.path) && "bg-primary/20 text-primary font-medium",
                  !isActive(subItem.path) && "text-muted-foreground hover:text-foreground"
                )}
                style={{ width: "calc(100% - 16px)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                {subItem.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-[280px] bg-gradient-to-b from-sidebar-background to-sidebar-background/95 border-r border-border shadow-xl transition-transform duration-300 flex flex-col",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                TOPS QRT
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Quality Response Team</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Bottom Menu */}
        <div className="border-t border-border/50 py-4 space-y-1">
          {bottomMenuItems.map(item => renderMenuItem(item, true))}
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to login again to access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowLogoutDialog(false);
              // Mock logout action
              console.log("User logged out");
            }}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
