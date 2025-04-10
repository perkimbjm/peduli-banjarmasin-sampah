
import { useState, ReactNode, useEffect } from "react";
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
