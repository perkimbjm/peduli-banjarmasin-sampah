
// src/components/layouts/ProtectedLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  Home, 
  Sun, 
  Moon, 
  Map, 
  FileBarChart2, 
  BookOpen, 
  Users, 
  Trash2, 
  Settings, 
  LogOut,
  MessagesSquare,
  Building2,
  AlertCircle,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProtectedLayout = () => {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  // Set theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Update collapsed state when screen size changes
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  // Get user's display information
  const userEmail = user?.email || 'admin@example.com';
  const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase();

  // Navigation items based on user role
  const navigationItems = [
    { name: "Beranda", href: "/dashboard", icon: Home, roles: ['admin', 'volunteer', 'leader', 'stakeholder'] },
    { name: "WebGIS", href: "/webgis-admin", icon: Map, roles: ['admin', 'leader', 'stakeholder'] },
    { name: "Analitik", href: "/dashboard-admin", icon: FileBarChart2, roles: ['admin', 'leader', 'stakeholder'] },
    { name: "Edukasi", href: "/edukasi-admin", icon: BookOpen, roles: ['admin', 'leader', 'stakeholder'] },
    { name: "Portal Kolaborasi", href: "/kolaborasi", icon: MessagesSquare, roles: ['admin', 'volunteer', 'leader', 'stakeholder'] },
    { name: "Bank Sampah", href: "/bank-sampah", icon: Building2, roles: ['admin', 'leader', 'stakeholder'] },
    { name: "Pengaduan", href: "/pengaduan", icon: AlertCircle, roles: ['admin', 'leader', 'stakeholder'] },
    { name: "Logistik", href: "/logistik", icon: Truck, roles: ['admin', 'leader', 'stakeholder'] },
    { name: "Pengguna", href: "/users", icon: Users, roles: ['admin'] },
    { name: "Pengaturan", href: "/settings", icon: Settings, roles: ['admin', 'volunteer', 'leader', 'stakeholder'] },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    !userRole || item.roles.includes(userRole)
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 py-4 px-4">
              <div className="h-8 w-8 bg-peduli-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PS</span>
              </div>
              <span className="font-bold text-lg">PeduliSampah</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={item.name}
                  >
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => navigate(item.href)}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.name}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3 p-4 border-t">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt={userEmail} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none truncate">{userEmail}</p>
                <p className="text-xs text-muted-foreground">
                  {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 w-full">
          <div className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="shrink-0"
              >
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
              
              <div className="ml-auto flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
