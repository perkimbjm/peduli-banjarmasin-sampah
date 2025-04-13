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
  LayoutDashboard,
  CalendarDays,
  Map,
  BookOpen,
  AlignJustify,
  Users,
  Settings,
  Building,
  ClipboardList,
  FileBarChart,
  Truck,
  BarChart3,
  MapPin,
  CircleDollarSign
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
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Laporan",
      href: "/laporan",
      icon: ClipboardList,
    },
    {
      title: "Jadwal",
      href: "/jadwal",
      icon: CalendarDays,
    },
    {
      title: "WebGIS",
      href: "/webgis",
      icon: Map,
    },
    {
      title: "Edukasi",
      href: "/edukasi",
      icon: BookOpen,
    },
    // Admin Only
    {
      title: "WebGIS Admin",
      href: "/webgis-admin",
      icon: Map,
      roles: ["admin", "leader", "stakeholder"],
    },
    {
      title: "Edukasi Admin",
      href: "/edukasi-admin",
      icon: BookOpen,
      roles: ["admin", "leader", "stakeholder"],
    },
    {
      title: "Kolaborasi",
      href: "/kolaborasi",
      icon: AlignJustify,
    },
    {
      title: "Bank Sampah",
      href: "/bank-sampah",
      icon: Building,
      roles: ["admin", "leader", "stakeholder"],
    },
    {
      title: "Pengaduan",
      href: "/pengaduan",
      icon: AlignJustify,
      roles: ["admin", "leader", "stakeholder"],
    },
    {
      title: "Logistik",
      href: "/logistik",
      icon: AlignJustify,
      roles: ["admin", "leader", "stakeholder"],
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Petugas",
      href: "/petugas",
      icon: Users,
      roles: ["admin", "leader", "stakeholder"],
    },
    {
      title: "Tugas",
      href: "/tugas",
      icon: AlignJustify,
      roles: ["admin", "leader", "stakeholder"],
    },
    {
      title: "Monitoring Ritase",
      href: "/monitoring-ritase",
      icon: Truck,
      roles: ["admin", "leader", "stakeholder"],
    },
    {
      title: "Monitoring Kinerja",
      href: "/monitoring-kinerja",
      icon: BarChart3,
      roles: ["admin", "leader", "stakeholder"],
    },
    {
      title: "Monitoring Sumber Sampah",
      href: "/monitoring-sumber-sampah",
      icon: MapPin,
      roles: ["admin", "leader", "stakeholder"],
    },
    {
      title: "Monitoring Ekonomi Sirkular",
      href: "/monitoring-ekonomi-sirkular",
      icon: CircleDollarSign,
      roles: ["admin", "leader", "stakeholder"],
    },
  ];

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const renderNavItems = () => {
    return navigationItems.map((item, index) => {
      if (item.roles && !item.roles.includes(user?.role || "")) {
        return null;
      }

      return (
        <Button
          key={index}
          variant="ghost"
          className={cn(
            "justify-start rounded-md px-2.5 py-2 font-medium hover:bg-secondary/50",
            location.pathname === item.href
              ? "bg-secondary/50 text-primary"
              : "text-secondary-foreground"
          )}
          onClick={() => {
            navigate(item.href);
            setIsMenuOpen(false);
          }}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.title}</span>
        </Button>
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
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>Keluar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {renderNavItems()}
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
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    Pengaturan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>Keluar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {renderNavItems()}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
