import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex-1 w-full">
      <div className="container max-w-7xl mx-auto px-4 py-6 md:py-8">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
