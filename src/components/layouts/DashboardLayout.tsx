import { useState, ReactNode, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";


type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  // Update collapsed state when screen size changes
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        {/* Sidebar with collapsible state */}
        <Sidebar isCollapsed={isCollapsed} />
        
        {/* Main content */}
        <div className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-[80px]" : "ml-0 md:ml-[280px]"
        )}>
          {/* Top header bar */}
          <div className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center gap-4 px-4 sm:px-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="shrink-0"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
              
            </div>
          </div>

          {/* Page content with consistent padding */}
          <div className="flex-1 w-full overflow-auto">
            <div className="container max-w-7xl mx-auto px-4 py-6 md:py-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
