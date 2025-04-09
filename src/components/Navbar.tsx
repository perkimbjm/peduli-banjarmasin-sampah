
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
              <Button asChild className="btn-primary mr-2">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="btn-outline">
                <Link to="/register">Daftar</Link>
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="sr-only">Open main menu</span>
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
        <div className="md:hidden">
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
              <Button asChild className="btn-primary w-full">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </Button>
              <Button asChild variant="outline" className="btn-outline w-full">
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>Daftar</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
