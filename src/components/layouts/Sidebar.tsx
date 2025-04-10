
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
  LogOut,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isHovering, setIsHovering] = useState(false);
  
  const navigation = [
    { name: "Beranda", href: "/dashboard", icon: Home },
    { name: "WebGIS", href: "/webgis-admin", icon: Map },
    { name: "Analitik", href: "/dashboard-admin", icon: FileBarChart2 },
    { name: "Edukasi", href: "/edukasi-admin", icon: BookOpen },
    { name: "Pengguna", href: "/users-admin", icon: Users },
    { name: "Sampah", href: "/waste-admin", icon: Trash2 },
    { name: "Pengaturan", href: "/settings", icon: Settings },
  ];

  // Get user's display information
  const userEmail = user?.email || 'admin@example.com';
  const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Logo area */}
      <div
        className={cn(
          "flex h-16 items-center border-b px-6",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-peduli-600 flex items-center justify-center">
            <span className="text-white font-bold">PS</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-semibold">PeduliSampah</span>
          )}
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-peduli-600 text-white" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(!isCollapsed || isHovering) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User profile section */}
      <div
        className={cn(
          "border-t p-4",
          isCollapsed ? "items-center" : "items-start"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={userEmail} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          
          {!isCollapsed && (
            <div className="space-y-1 overflow-hidden">
              <p className="text-sm font-medium leading-none truncate">{userEmail}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.user_metadata?.role || 'User'}
              </p>
            </div>
          )}

          {!isCollapsed && (
            <button 
              onClick={async () => await signOut()}
              className="ml-auto text-muted-foreground hover:text-foreground"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
