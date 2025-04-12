import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)]" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-peduli-50/50 via-white/50 to-peduli-100/50 dark:from-peduli-900/50 dark:via-gray-900/50 dark:to-peduli-800/50" />
      
      {/* Content */}
      <div className="relative">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              <span className="block">Smart Waste Management</span>
              <span className="block text-peduli-600 dark:text-peduli-400">Untuk Banjarmasin yang Lebih Bersih</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Sistem pengelolaan sampah berbasis teknologi untuk meningkatkan efisiensi, 
              transparansi, dan partisipasi masyarakat dalam menjaga kebersihan kota.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/webgis" className={cn(buttonVariants({ size: "lg" }))}>
                Lihat WebGIS
              </Link>
              <Link to="/edukasi" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1/3 h-1/2 bg-peduli-100/20 dark:bg-peduli-800/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1/3 h-1/2 bg-peduli-200/20 dark:bg-peduli-700/20 rounded-full blur-3xl" />
    </div>
  );
};

export default Hero; 