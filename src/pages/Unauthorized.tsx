
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Akses Ditolak</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator jika Anda memerlukan akses.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/dashboard">Kembali ke Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
