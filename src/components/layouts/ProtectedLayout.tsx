// src/components/layouts/ProtectedLayout.tsx
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Menu, Sun, Moon, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const ProtectedLayout = () => {
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

    // Handle sign out
    const handleSignOut = async () => {
      try {
        await signOut();
        navigate("/login");
      } catch (error) {
        console.error("Failed to sign out", error);
      }
    };

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
  const userEmail = user?.email || 'User';
  const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen overflow-hidden">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 py-2 px-4">
              <div className="h-8 w-8 bg-peduli-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PS</span>
              </div>
              <span className="font-bold text-lg">PeduliSampah</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="p-4">
              <p>Menu Item 1</p>
              <p>Menu Item 2</p>
              <p>Menu Item 3</p>
            </div>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3 p-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={userEmail} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none truncate">{userEmail}</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
          {/* Top header bar */}
          <div className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center gap-4 px-4 sm:px-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="shrink-0"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
              
              <div className="ml-auto flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={userEmail} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userEmail}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.user_metadata?.role || 'User'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <button className="w-full flex cursor-pointer items-center" onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
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
          </div>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
