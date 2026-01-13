import { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile header with menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </Button>
      </div>

      {/* Main content */}
      <main className="lg:ml-[280px] min-h-screen pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
};
