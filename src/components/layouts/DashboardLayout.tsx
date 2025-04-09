
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
} from "@/components/ui/sidebar";

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
  
  // Set initial theme on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
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

  // Define menu items with their access restrictions
  const menuItems: MenuItem[] = [
    { 
      title: "Dashboard", 
      path: "/dashboard", 
      icon: LayoutDashboard 
    },
    { 
      title: "Pelaporan Masyarakat", 
      path: "/laporan", 
      icon: Trash2 
    },
    { 
      title: "Jadwal Pengelolaan", 
      path: "/jadwal", 
      icon: Calendar,
      allowedRoles: ['admin', 'leader', 'stakeholder']
    },
    { 
      title: "WebGIS Interaktif", 
      path: "/webgis-admin", 
      icon: Map,
      allowedRoles: ['admin', 'leader', 'stakeholder']
    },
    { 
      title: "Manajemen Edukasi", 
      path: "/edukasi-admin", 
      icon: BookOpen,
      allowedRoles: ['admin', 'leader', 'stakeholder']
    },
    { 
      title: "Portal Kolaborasi", 
      path: "/kolaborasi", 
      icon: MessageSquare
    },
    { 
      title: "Bank Sampah", 
      path: "/bank-sampah", 
      icon: Landmark,
      allowedRoles: ['admin', 'leader', 'stakeholder']
    },
    { 
      title: "Logistik", 
      path: "/logistik", 
      icon: Truck,
      allowedRoles: ['admin', 'leader', 'stakeholder']
    },
    { 
      title: "Manajemen Pengaduan", 
      path: "/pengaduan", 
      icon: AlertCircle,
      allowedRoles: ['admin', 'leader', 'stakeholder']
    },
    { 
      title: "Manajemen User", 
      path: "/users", 
      icon: Users,
      allowedRoles: ['admin']
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(
    (item) => !item.allowedRoles || (userRole && item.allowedRoles.includes(userRole))
  );

  const isMenuItemActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen w-full flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <Sidebar variant="inset" collapsible="icon" className="hidden md:block">
        <SidebarHeader>
          <div className="flex items-center gap-2 py-2 px-4">
            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">PS</span>
            </div>
            <span className="font-bold text-lg">PeduliSampah</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMenuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      isActive={isMenuItemActive(item.path)}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-600 text-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user?.email?.split('@')[0]}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {userRole || 'volunteer'}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header for mobile and desktop */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center px-4">
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px]">
                <div className="flex items-center mb-6">
                  <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-sm">PS</span>
                  </div>
                  <span className="font-bold text-lg">PeduliSampah</span>
                </div>

                <nav className="space-y-1">
                  {filteredMenuItems.map((item) => (
                    <Button 
                      key={item.path}
                      variant={isMenuItemActive(item.path) ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Button>
                  ))}
                </nav>
              </SheetContent>

            </Sheet>
            
            {/* Logo */}
            <div className="flex items-center mr-4">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center mr-2 md:hidden">
                <span className="text-white font-bold text-sm">PS</span>
              </div>
              <span className="font-bold text-lg md:hidden">PeduliSampah</span>
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              {/* Theme toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              
              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 flex items-center gap-2 pl-2 pr-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-600 text-white">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-flex text-sm font-medium">
                      {user?.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.email && (
                        <>
                          <p className="font-medium">{user.email.split('@')[0]}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            Role: {userRole || 'volunteer'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
