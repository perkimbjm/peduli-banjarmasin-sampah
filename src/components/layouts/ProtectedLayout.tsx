
// src/components/layouts/ProtectedLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  Truck,
  UserRound,
  ClipboardList,
  Menu,
  X,
  Flag,
  BarChart2
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ProtectedLayout = () => {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  // Set theme on mount and when it changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Get user's display information
  const userEmail = user?.email || 'admin@example.com';
  const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase();

  // Sidebar menu structure sesuai instruksi (8 utama, submenus, role-based)
  const sidebarMenu = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
      roles: ["admin", "leader", "stakeholder", "volunteer", "user"],
    },
    {
      title: "WebGIS",
      icon: Map,
      submenus: [
        { title: "Peta Monitoring", href: "/webgis-admin/peta-monitoring" },
        { title: "GIS Analitik", href: "/webgis-admin/gis-analitik" },
      ],
      roles: ["admin", "leader", "stakeholder", "volunteer", "user"],
    },
    {
      title: "Monitoring",
      icon: BarChart2,
      submenus: [
        { title: "Sumber Sampah", href: "/monitoring/sumber-sampah" },
        { title: "Ritase Kendaraan", href: "/monitoring/ritase-kendaraan" },
        { title: "Kinerja Wilayah", href: "/monitoring/kinerja-wilayah" },
        { title: "Kinerja Fasilitas", href: "/monitoring/kinerja-fasilitas" },
      ],
      roles: ["admin", "leader", "stakeholder", "volunteer", "user"],
    },
    {
      title: "Edukasi",
      icon: BookOpen,
      submenus: [
        { title: "Konten Edukasi", href: "/education/konten" },
        { title: "Statistik Kampanye", href: "/education/statistik" },
      ],
      roles: ["admin", "leader", "stakeholder", "volunteer", "user"],
    },
    {
      title: "Kolaborasi",
      icon: MessagesSquare,
      submenus: [
        { title: "Forum Diskusi", href: "/kolaborasi/forum" },
        { title: "Perpustakaan Digital", href: "/kolaborasi/perpustakaan" },
      ],
      roles: ["admin", "leader", "stakeholder", "volunteer", "user"],
    },
    {
      title: "Bank Sampah",
      icon: Building2,
      submenus: [
        { title: "Data Bank Sampah", href: "/bank-sampah/data" },
      ],
      roles: ["admin", "leader", "stakeholder", "volunteer", "user"],
    },
    {
      title: "Manajemen",
      icon: Users,
      submenus: [
        { title: "Petugas", href: "/manajemen/petugas" },
        { title: "Tugas", href: "/manajemen/tugas" },
        { title: "Armada & Rute", href: "/manajemen/armada-rute" },
        { title: "Pengguna", href: "/manajemen/pengguna", roles: ["admin"] },
      ],
      roles: ["admin", "leader", "stakeholder"],
    },
    {
      title: "Pengaturan",
      icon: Settings,
      submenus: [
        { title: "Profil", href: "/pengaturan/profil" },
        { title: "Notifikasi", href: "/pengaturan/notifikasi" },
        { title: "Keamanan", href: "/pengaturan/keamanan" },
        { title: "Tampilan", href: "/pengaturan/tampilan" },
      ],
      roles: ["admin", "leader", "stakeholder", "volunteer", "user"],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = sidebarMenu.filter(item => 
    !userRole || item.roles.includes(userRole)
  );

  // Helper for role access
  const hasAccess = (roles) => {
    if (!roles) return true;
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  // Sidebar menu rendering with collapsible submenus
  const renderSidebarMenu = () =>
    sidebarMenu.map((item) => {
      if (!hasAccess(item.roles)) return null;
      if (!item.submenus) {
        return (
          <button
            key={item.title}
            onClick={() => {
              navigate(item.href);
              if (isMobile) setIsOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              location.pathname.startsWith(item.href)
                ? "bg-peduli-100 text-peduli-600 dark:bg-peduli-900 dark:text-peduli-400"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </button>
        );
      }
      // Collapsible for submenus
      return (
        <div key={item.title} className="mb-1">
          <details className="group">
            <summary
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold transition-colors select-none",
                item.submenus.some((sm) => location.pathname.startsWith(sm.href))
                  ? "bg-peduli-100 text-peduli-600 dark:bg-peduli-900 dark:text-peduli-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.title}</span>
              {/* Simple chevron icon for collapsible, rotates when open */}
              <svg className="ml-auto h-4 w-4 transition-transform group-open:rotate-90" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </summary>
            <div className="ml-7 mt-1 flex flex-col gap-1">
              {item.submenus.map((submenu) => {
                if (!hasAccess(submenu.roles)) return null;
                return (
                  <button
                    key={submenu.title}
                    onClick={() => {
                      navigate(submenu.href);
                      if (isMobile) setIsOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded px-2 py-1 text-base font-normal transition-colors hover:bg-muted hover:text-foreground",
                      location.pathname.startsWith(submenu.href)
                        ? "bg-peduli-100 text-peduli-600 dark:bg-peduli-900 dark:text-peduli-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {submenu.title}
                  </button>
                );
              })}
            </div>
          </details>
        </div>
      );
    });

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300 ease-in-out",
          !isOpen && "-translate-x-full",
          "lg:fixed lg:translate-x-0",
          !isOpen && "lg:-translate-x-full",
          isMobile && !isOpen && "w-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-peduli-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PS</span>
              </div>
              <span className="font-bold text-lg">PeduliSampah</span>
            </div>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {renderSidebarMenu()}
            </div>
          </nav>

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
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
              <button 
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "ml-auto")}
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex flex-1 flex-col min-h-screen transition-all duration-300 ease-in-out",
        isOpen ? "lg:pl-64" : "lg:pl-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-4">
            <button 
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </button>

            <div className="ml-auto flex items-center gap-4">
              <button 
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                onClick={toggleTheme}
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(buttonVariants({ variant: "ghost" }), "relative h-8 w-8 rounded-full")}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={userEmail} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userEmail}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button className="w-full flex cursor-pointer items-center" onClick={() => navigate('/profile')}>
                      <UserRound className="mr-2 h-4 w-4" />
                      Profil
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button className="w-full flex cursor-pointer items-center" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ProtectedLayout;
