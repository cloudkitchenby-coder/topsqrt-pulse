import { ChevronDown, Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations } from "@/lib/mockData";
import { SystemHealthBadge } from "./SystemHealthBadge";
import { DemoModeToggle } from "./DemoModeToggle";
import { ClientJourneyModal } from "./ClientJourneyModal";

interface HeaderProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  isMasterView: boolean;
  onToggleView: () => void;
}

export const Header = ({ 
  selectedLocation, 
  onLocationChange, 
  isMasterView, 
  onToggleView 
}: HeaderProps) => {
  return (
    <header className="gradient-header shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-primary-foreground font-bold text-xl tracking-tight">TOPS QRT</h1>
                <p className="text-primary-foreground/70 text-xs">Field Operations</p>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-primary-foreground/20" />

            <Select value={selectedLocation} onValueChange={onLocationChange}>
              <SelectTrigger className="w-[180px] bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 transition-colors">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="hidden md:block">
              <SystemHealthBadge />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <DemoModeToggle />
            
            <ClientJourneyModal />

            <Button
              variant="outline"
              size="sm"
              onClick={onToggleView}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
            >
              {isMasterView ? "Field View" : "Master View"}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium leading-none">Sandeep Sachdeva</p>
                    <p className="text-xs text-primary-foreground/70">sandeep.s@topsqrt.com</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-primary-foreground/60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
