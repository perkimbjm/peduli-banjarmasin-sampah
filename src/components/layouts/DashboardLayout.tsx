
import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
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

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex items-center mb-6">
                  <div className="h-8 w-8 bg-peduli-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-sm">PS</span>
                  </div>
                  <span className="font-bold text-lg">PeduliSampah</span>
                </div>
                <nav className="space-y-1">
                  {/* TODO: Add sidebar navigation items here */}
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <div className="h-8 w-8 bg-peduli-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">PS</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">PeduliSampah</span>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
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
                    <AvatarFallback className="bg-peduli-600 text-white">
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

      {/* Main content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar (desktop only) */}
        <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>
          <nav className="flex-1 px-4 pb-6 space-y-1">
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/dashboard')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            {/* TODO: Add sidebar navigation items here */}
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
