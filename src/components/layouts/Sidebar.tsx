import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Map,
  FileBarChart2,
  BookOpen,
  Settings,
  Users,
  Trash2,
} from "lucide-react";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Beranda", href: "/dashboard", icon: Home },
    { name: "WebGIS", href: "/webgis-admin", icon: Map },
    { name: "Analitik", href: "/dashboard-admin", icon: FileBarChart2 },
    { name: "Edukasi", href: "/edukasi-admin", icon: BookOpen },
    { name: "Pengguna", href: "/users-admin", icon: Users },
    { name: "Sampah", href: "/waste-admin", icon: Trash2 },
    { name: "Pengaturan", href: "/settings", icon: Settings },
  ];

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[80px]" : "w-[280px]"
    )}>
      {/* Logo area */}
      <div className={cn(
        "flex h-16 items-center border-b px-6",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">PS</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-semibold">PeduliSampah</span>
          )}
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User profile section */}
      <div className={cn(
        "border-t p-4",
        isCollapsed ? "items-center" : "items-start"
      )}>
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && "justify-center"
        )}>
          <div className="h-8 w-8 rounded-full bg-muted" />
          {!isCollapsed && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
