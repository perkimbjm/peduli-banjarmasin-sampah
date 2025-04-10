import { useState, ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  FileBarChart,
  Trash2, 
  Calendar, 
  Map, 
  BookOpen, 
  MessageSquare, 
  Landmark, 
  Truck, 
  AlertCircle, 
  Users,
  LogOut, 
  Menu, 
  X, 
  User, 
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type MenuItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  allowedRoles?: string[];
};

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout gagal",
        description: "Terjadi kesalahan saat keluar dari akun",
      });
    }
  };

  const menuItems: MenuItem[] = [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "Pelaporan Masyarakat", path: "/laporan", icon: Trash2 },
    { title: "Jadwal Pengelolaan", path: "/jadwal", icon: Calendar, allowedRoles: ['admin', 'leader', 'stakeholder'] },
    { title: "WebGIS Interaktif", path: "/webgis-admin", icon: Map, allowedRoles: ['admin', 'leader', 'stakeholder'] },
    { title: "Manajemen Edukasi", path: "/edukasi-admin", icon: BookOpen, allowedRoles: ['admin', 'leader', 'stakeholder'] },
    { title: "Portal Kolaborasi", path: "/kolaborasi", icon: MessageSquare },
    { title: "Bank Sampah", path: "/bank-sampah", icon: Landmark, allowedRoles: ['admin', 'leader', 'stakeholder'] },
    { title: "Logistik", path: "/logistik", icon: Truck, allowedRoles: ['admin', 'leader', 'stakeholder'] },
    { title: "Manajemen Pengaduan", path: "/pengaduan", icon: AlertCircle, allowedRoles: ['admin', 'leader', 'stakeholder'] },
    { title: "Manajemen User", path: "/users", icon: Users, allowedRoles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.allowedRoles || (userRole && item.allowedRoles.includes(userRole))
  );

  const isMenuItemActive = (path: string) => location.pathname === path;

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar with collapsible state */}
      <Sidebar isCollapsed={isCollapsed} />
      
      {/* Main content */}
      <main className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "pl-[80px]" : "pl-[280px]"
      )}>
        {/* Top header bar */}
        <div className="sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-full items-center gap-4 px-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Page content with consistent padding */}
        <div className="container py-6 md:py-8 max-w-6xl mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
