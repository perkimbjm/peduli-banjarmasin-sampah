
// src/components/Navbar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Don't show auth buttons while loading
  if (isLoading) {
    return null;
  }

  // Check if user exists instead of using isAuthenticated
  const isAuthenticated = !!user;
  
  // Get user's display information if authenticated
  const userEmail = user?.email || 'admin@example.com';
  const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-peduli-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">PS</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                PeduliSampah
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-peduli-600 dark:hover:text-peduli-400 font-medium">
              Beranda
            </Link>
            <Link to="/webgis" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-peduli-600 dark:hover:text-peduli-400 font-medium">
              WebGIS
            </Link>
            <Link to="/dashboard-publik" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-peduli-600 dark:hover:text-peduli-400 font-medium">
              Analitik
            </Link>
            <Link to="/edukasi" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-peduli-600 dark:hover:text-peduli-400 font-medium">
              Edukasi
            </Link>
            <div className="ml-4 flex items-center">
              {isAuthenticated ? (
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
                      <Link to="/dashboard" className="flex cursor-pointer items-center">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button className="w-full flex cursor-pointer items-center" onClick={() => signOut()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild className="btn-primary mr-2">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild variant="outline" className="btn-outline">
                    <Link to="/register">Daftar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Navigation Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link 
              to="/" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              to="/webgis" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              WebGIS
            </Link>
            <Link 
              to="/dashboard-publik" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Analitik
            </Link>
            <Link 
              to="/edukasi" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Edukasi
            </Link>
            
            <div className="flex flex-col space-y-2 mt-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-3 py-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="" alt={userEmail} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{userEmail}</p>
                    </div>
                  </div>
                  <Button asChild className="btn-primary w-full">
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" className="btn-outline w-full" onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}>
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="btn-primary w-full">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="btn-outline w-full">
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      Daftar
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
