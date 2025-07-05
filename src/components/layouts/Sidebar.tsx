import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  BookOpen,
  Users,
  Settings,
  Building,
  ClipboardList,
  Truck,
  AlignJustify,
  FileBarChart,
  MapPin,
  CircleDollarSign,
  UserCog,
  Bell,
  Shield,
  Monitor
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles?: string[];
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define the new sidebar menu structure (replace old menu)
  const sidebarMenu = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["admin", "leader", "stakeholder", "user"],
    },
    {
      title: "WebGIS",
      icon: Map,
      submenus: [
        { title: "Peta Monitoring", href: "/webgis-admin/peta-monitoring" },
        { title: "GIS Analitik", href: "/webgis-admin/gis-analitik" },
      ],
      roles: ["admin", "leader", "stakeholder", "user"],
    },
    {
      title: "Monitoring",
      icon: BarChart3,
      submenus: [
        { title: "Sumber Sampah", href: "/monitoring/sumber-sampah" },
        { title: "Ritase Kendaraan", href: "/monitoring/ritase-kendaraan" },
        { title: "Kinerja Wilayah", href: "/monitoring/kinerja-wilayah" },
        { title: "Kinerja Fasilitas", href: "/monitoring/kinerja-fasilitas" },
      ],
      roles: ["admin", "leader", "stakeholder", "user"],
    },
    {
      title: "Edukasi & Kampanye",
      icon: BookOpen,
      submenus: [
        { title: "Konten Edukasi", href: "/edukasi/konten" },
        { title: "Statistik Kampanye", href: "/edukasi/statistik" },
      ],
      roles: ["admin", "leader", "stakeholder", "user"],
    },
    {
      title: "Kolaborasi",
      icon: AlignJustify,
      submenus: [
        { title: "Forum Diskusi", href: "/kolaborasi/forum" },
        { title: "Perpustakaan Digital", href: "/kolaborasi/perpustakaan" },
      ],
      roles: ["admin", "leader", "stakeholder", "user"],
    },
    {
      title: "Bank Sampah",
      icon: Building,
      submenus: [
        { title: "Data Bank Sampah", href: "/bank-sampah/data" },
        { title: "Data TPS 3R", href: "/bank-sampah/tps3r" },
      ],
      roles: ["admin", "leader", "stakeholder", "user"],
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
        { title: "Profil", href: "/pengaturan/profil", icon: UserCog },
        { title: "Notifikasi", href: "/pengaturan/notifikasi", icon: Bell },
        { title: "Keamanan", href: "/pengaturan/keamanan", icon: Shield },
        { title: "Tampilan", href: "/pengaturan/tampilan", icon: Monitor },
      ],
      roles: ["admin", "leader", "stakeholder", "user"],
    },
  ];

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  // Helper to check role access
  const hasAccess = (itemRoles?: string[]) => {
    if (!itemRoles) return true;
    if (!user?.role && !user?.user_metadata?.role && !user?.app_metadata?.role && !userRole) return false;
    const role = userRole || user?.role || user?.user_metadata?.role || user?.app_metadata?.role;
    return itemRoles.includes(role);
  };

  // Render sidebar menu (replace all previous nav rendering)
  const renderSidebarMenu = () => {
    return sidebarMenu.map((item) => {
      if (!hasAccess(item.roles)) return null;
      if (!item.submenus) {
        // Direct link (no submenu)
        return (
          <Button
            key={item.title}
            variant="ghost"
            className={cn(
              "w-full justify-start rounded-md px-2.5 py-2 font-medium hover:bg-secondary/50",
              location.pathname.startsWith(item.href)
                ? "bg-secondary/50 text-primary"
                : "text-secondary-foreground"
            )}
            onClick={() => navigate(item.href)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Button>
        );
      }
      // Collapsible with submenus
      return (
        <Collapsible key={item.title}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md px-2.5 py-2 font-medium hover:bg-secondary/50 flex items-center",
                item.submenus.some((sm) => location.pathname.startsWith(sm.href))
                  ? "bg-secondary/50 text-primary"
                  : "text-secondary-foreground"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span className="flex-1 text-left">{item.title}</span>
              <span className="ml-auto">▸</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6">
            {item.submenus.map((submenu) => {
              if (!hasAccess(submenu.roles)) return null;
              return (
                <Button
                  key={submenu.title}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-md px-2 py-1 text-sm font-normal hover:bg-secondary/40",
                    location.pathname.startsWith(submenu.href)
                      ? "bg-secondary/40 text-primary"
                      : "text-secondary-foreground"
                  )}
                  onClick={() => navigate(submenu.href)}
                >
                  {submenu.icon && <submenu.icon className="mr-2 h-4 w-4" />}
                  {submenu.title}
                </Button>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      );
    });
  };

  return (
    <>
      <aside className="hidden border-r bg-sidebar-background w-60 flex-col py-3 md:flex">
        <ScrollArea className="flex-1 space-y-2 px-3">
          <div className="flex items-center justify-between rounded-md px-2 py-1.5">
            <span className="font-bold">
              {user?.email}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Akun</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>Profil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>Pengaturan</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>Keluar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {renderSidebarMenu()}
        </ScrollArea>
      </aside>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="absolute bottom-4 left-4 rounded-full md:hidden"
          >
            <AlignJustify className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="flex h-screen flex-col">
          <SheetHeader className="px-5 pt-5 pb-2.5">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 space-y-2 px-3">
            <div className="flex items-center justify-between rounded-md px-2 py-1.5">
              <span className="font-bold">
                {user?.email}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Akun</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>Profil</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>Pengaturan</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>Keluar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {renderSidebarMenu()}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
