
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  BookOpen,
  Users,
  Building,
  Settings,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Truck,
  MapPin,
  MessageSquare,
  Library,
  Database,
  UserCheck,
  ClipboardList,
  Route,
  User,
  Bell,
  Shield,
  Palette,
  CircleDollarSign,
  Globe
} from "lucide-react";
import { NavigationMenu, MenuItem } from "./types";

const NavigationSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openGroups, setOpenGroups] = useState<string[]>(['dashboard']);

  const menuStructure: NavigationMenu[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      roles: ['admin', 'volunteer', 'leader', 'stakeholder']
    },
    {
      id: 'webgis',
      title: 'WebGIS',
      icon: Map,
      roles: ['admin', 'leader', 'stakeholder'],
      children: [
        {
          id: 'peta-monitoring',
          title: 'Peta Monitoring',
          href: '/webgis',
          icon: Globe
        },
        {
          id: 'gis-analitik',
          title: 'GIS Analitik',
          href: '/webgis-admin',
          icon: TrendingUp
        }
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring',
      icon: BarChart3,
      roles: ['admin', 'leader', 'stakeholder'],
      children: [
        {
          id: 'sumber-sampah',
          title: 'Sumber Sampah',
          href: '/monitoring-sumber-sampah',
          icon: MapPin
        },
        {
          id: 'ritase-kendaraan',
          title: 'Ritase Kendaraan',
          href: '/monitoring-ritase',
          icon: Truck
        },
        {
          id: 'kinerja-wilayah',
          title: 'Kinerja Wilayah',
          href: '/monitoring-kinerja',
          icon: TrendingUp
        },
        {
          id: 'kinerja-fasilitas',
          title: 'Kinerja Fasilitas',
          href: '/monitoring-ekonomi-sirkular',
          icon: CircleDollarSign
        }
      ]
    },
    {
      id: 'edukasi',
      title: 'Edukasi & Kampanye',
      icon: BookOpen,
      roles: ['admin', 'leader', 'stakeholder'],
      children: [
        {
          id: 'konten-edukasi',
          title: 'Konten Edukasi',
          href: '/edukasi-admin',
          icon: BookOpen
        },
        {
          id: 'statistik-kampanye',
          title: 'Statistik Kampanye',
          href: '/edukasi',
          icon: BarChart3
        }
      ]
    },
    {
      id: 'kolaborasi',
      title: 'Kolaborasi',
      icon: Users,
      roles: ['admin', 'volunteer', 'leader', 'stakeholder'],
      children: [
        {
          id: 'forum-diskusi',
          title: 'Forum Diskusi',
          href: '/kolaborasi',
          icon: MessageSquare
        },
        {
          id: 'perpustakaan-digital',
          title: 'Perpustakaan Digital',
          href: '/edukasi',
          icon: Library
        }
      ]
    },
    {
      id: 'bank-sampah',
      title: 'Bank Sampah',
      icon: Building,
      roles: ['admin', 'leader', 'stakeholder'],
      children: [
        {
          id: 'data-bank-sampah',
          title: 'Data Bank Sampah',
          href: '/bank-sampah',
          icon: Database
        },
        {
          id: 'data-tps-3r',
          title: 'Data TPS 3R',
          href: '/logistik',
          icon: Building
        }
      ]
    },
    {
      id: 'manajemen',
      title: 'Manajemen',
      icon: Settings,
      roles: ['admin', 'leader', 'stakeholder'],
      children: [
        {
          id: 'petugas',
          title: 'Petugas',
          href: '/petugas',
          icon: UserCheck
        },
        {
          id: 'tugas',
          title: 'Tugas',
          href: '/tugas',
          icon: ClipboardList
        },
        {
          id: 'armada-rute',
          title: 'Armada & Rute',
          href: '/jadwal',
          icon: Route
        },
        {
          id: 'pengguna',
          title: 'Pengguna',
          href: '/users',
          icon: Users,
          roles: ['admin']
        }
      ]
    },
    {
      id: 'pengaturan',
      title: 'Pengaturan',
      icon: Settings,
      roles: ['admin', 'volunteer', 'leader', 'stakeholder'],
      children: [
        {
          id: 'profil',
          title: 'Profil',
          href: '/profile',
          icon: User
        },
        {
          id: 'notifikasi',
          title: 'Notifikasi',
          href: '/settings',
          icon: Bell
        },
        {
          id: 'keamanan',
          title: 'Keamanan',
          href: '/settings',
          icon: Shield
        },
        {
          id: 'tampilan',
          title: 'Tampilan',
          href: '/settings',
          icon: Palette
        }
      ]
    }
  ];

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleItemClick = (item: MenuItem | NavigationMenu) => {
    if (item.href) {
      navigate(item.href);
    }
  };

  const isItemActive = (item: MenuItem | NavigationMenu): boolean => {
    if (item.href && location.pathname === item.href) return true;
    
    if ('children' in item && item.children) {
      return item.children.some(child => location.pathname === child.href);
    }
    
    return false;
  };

  const filterMenuByRole = (menu: NavigationMenu): NavigationMenu | null => {
    const userRole = user?.role || 'volunteer';
    
    // Check if user has access to this menu item
    if (menu.roles && !menu.roles.includes(userRole)) {
      return null;
    }

    // Filter children if they exist
    if (menu.children) {
      const filteredChildren = menu.children.filter(child => {
        if (child.roles && !child.roles.includes(userRole)) {
          return false;
        }
        return true;
      });

      return {
        ...menu,
        children: filteredChildren.length > 0 ? filteredChildren : undefined
      };
    }

    return menu;
  };

  const filteredMenu = menuStructure
    .map(filterMenuByRole)
    .filter((item): item is NavigationMenu => item !== null);

  const renderMenuItem = (item: NavigationMenu) => {
    const isActive = isItemActive(item);
    const isOpen = openGroups.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    if (!hasChildren) {
      return (
        <Button
          key={item.id}
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-md px-2.5 py-2 font-medium hover:bg-secondary/50",
            isActive
              ? "bg-secondary/50 text-primary"
              : "text-secondary-foreground"
          )}
          onClick={() => handleItemClick(item)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.title}</span>
        </Button>
      );
    }

    return (
      <Collapsible key={item.id} open={isOpen} onOpenChange={() => toggleGroup(item.id)}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between rounded-md px-2.5 py-2 font-medium hover:bg-secondary/50",
              isActive
                ? "bg-secondary/50 text-primary"
                : "text-secondary-foreground"
            )}
          >
            <div className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pl-4">
          {item.children?.map(child => (
            <Button
              key={child.id}
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md px-2.5 py-2 text-sm font-normal hover:bg-secondary/50",
                location.pathname === child.href
                  ? "bg-secondary/50 text-primary"
                  : "text-muted-foreground"
              )}
              onClick={() => handleItemClick(child)}
            >
              <child.icon className="mr-2 h-3 w-3" />
              <span>{child.title}</span>
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <ScrollArea className="flex-1 space-y-2 px-3">
      <div className="space-y-1">
        {filteredMenu.map(renderMenuItem)}
      </div>
    </ScrollArea>
  );
};

export default NavigationSidebar;
