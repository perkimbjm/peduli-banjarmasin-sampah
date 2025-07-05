
import { useState } from "react";
import {
  Home,
  BarChart3,
  BookOpen,
  Building2,
  Users,
  FileText,
  Map,
  Settings,
  User,
  LogOut,
  Monitor,
  MapPin,
  TrendingUp,
  Trash2,
  Recycle,
  Truck,
  BarChart,
  Users2,
  UserCheck,
  ClipboardList,
  Package,
  Handshake,
  MenuIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  title: string;
  url?: string;
  icon: any;
  submenu?: MenuItem[];
}

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut, profile } = useAuth();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const menuItems = [
    {
      title: "Beranda",
      url: "/",
      icon: Home,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Edukasi",
      url: "/edukasi",
      icon: BookOpen,
    },
    {
      title: "Bank Sampah",
      url: "/bank-sampah",
      icon: Building2,
    },
    {
      title: "Kolaborasi",
      icon: Users,
      submenu: [
        {
          title: "Program Kolaborasi",
          url: "/kolaborasi",
          icon: Handshake,
        },
        {
          title: "Perpustakaan Digital",
          url: "/kolaborasi/perpustakaan",
          icon: BookOpen,
        },
      ],
    },
    {
      title: "Pelaporan",
      url: "/pelaporan",
      icon: FileText,
    },
    {
      title: "WebGIS",
      url: "/webgis",
      icon: Map,
    },
  ];

  const adminMenuItems = [
    {
      title: "Dashboard Admin",
      url: "/admin/dashboard",
      icon: BarChart3,
    },
    {
      title: "Edukasi & Kampanye",
      icon: BookOpen,
      submenu: [
        {
          title: "Konten Edukasi",
          url: "/admin/education/konten",
          icon: FileText,
        },
      ],
    },
    {
      title: "WebGIS",
      icon: Map,
      submenu: [
        {
          title: "Peta Interaktif",
          url: "/admin/webgis",
          icon: MapPin,
        },
        {
          title: "Peta Monitoring",
          url: "/admin/webgis-admin",
          icon: Monitor,
        },
      ],
    },
    {
      title: "Monitoring",
      icon: Monitor,
      submenu: [
        {
          title: "Kinerja Wilayah",
          url: "/admin/monitoring/kinerja",
          icon: TrendingUp,
        },
        {
          title: "Sumber Sampah",
          url: "/admin/monitoring/sumber-sampah",
          icon: Trash2,
        },
        {
          title: "Ekonomi Sirkular",
          url: "/admin/monitoring/ekonomi-sirkular",
          icon: Recycle,
        },
        {
          title: "Ritase Kendaraan",
          url: "/admin/monitoring/ritase",
          icon: Truck,
        },
      ],
    },
    {
      title: "GIS Analytics",
      url: "/admin/gis-analytics",
      icon: BarChart,
    },
    {
      title: "Manajemen",
      icon: Users,
      submenu: [
        {
          title: "Petugas",
          url: "/admin/manajemen/petugas",
          icon: UserCheck,
        },
        {
          title: "Tugas",
          url: "/admin/manajemen/tugas",
          icon: ClipboardList,
        },
        {
          title: "Pengguna",
          url: "/admin/users",
          icon: Users,
        },
      ],
    },
    {
      title: "Logistik",
      url: "/admin/logistik",
      icon: Package,
    },
    {
      title: "Pengaturan",
      url: "/admin/settings",
      icon: Settings,
    },
  ];

  const userRole = user?.role;
  const userMenuItems = userRole === "admin" ? adminMenuItems : [];

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-64 flex flex-col gap-4 pr-0">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <Recycle className="w-6 h-6" />
          <span>SIGAP</span>
        </Link>
        <Separator />
        <div className="flex flex-col gap-2">
          {menuItems.map((item, index) =>
            item.submenu ? (
              <Accordion type="single" collapsible key={index}>
                <AccordionItem value={item.title}>
                  <AccordionTrigger className="font-medium">
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col pl-4">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.url || "#"}
                          className={cn(
                            "flex items-center gap-2 py-2 hover:bg-secondary rounded-md",
                            location.pathname === subItem.url ? "font-semibold" : ""
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <subItem.icon className="w-4 h-4 mr-2" />
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <Link
                key={index}
                to={item.url || "#"}
                className={cn(
                  "flex items-center gap-2 py-2 hover:bg-secondary rounded-md",
                  location.pathname === item.url ? "font-semibold" : ""
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.title}
              </Link>
            )
          )}
          {userRole && (
            <>
              <Separator />
              <p className="font-semibold text-sm">Admin Menu</p>
              {userMenuItems.map((item, index) =>
                item.submenu ? (
                  <Accordion type="single" collapsible key={index}>
                    <AccordionItem value={item.title}>
                      <AccordionTrigger className="font-medium">
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col pl-4">
                          {item.submenu.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.url || "#"}
                              className={cn(
                                "flex items-center gap-2 py-2 hover:bg-secondary rounded-md",
                                location.pathname === subItem.url ? "font-semibold" : ""
                              )}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <subItem.icon className="w-4 h-4 mr-2" />
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <Link
                    key={index}
                    to={item.url || "#"}
                    className={cn(
                      "flex items-center gap-2 py-2 hover:bg-secondary rounded-md",
                      location.pathname === item.url ? "font-semibold" : ""
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.title}
                  </Link>
                )
              )}
            </>
          )}
        </div>
        <Separator />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start gap-2 w-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {profile?.full_name?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <p className="text-sm font-medium">{profile?.full_name || user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem>
                <Link to="/admin/profile" className="w-full">
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/admin/settings" className="w-full">
                  Pengaturan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Keluar
                <LogOut className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login">
            <Button variant="outline">Masuk</Button>
          </Link>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
