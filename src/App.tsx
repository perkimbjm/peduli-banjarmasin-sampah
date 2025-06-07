
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layouts
import PublicLayout from "@/components/layouts/PublicLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

// Pages
import Index from "@/pages/Index";
import WebGIS from "@/pages/WebGIS";
import DashboardPublic from "@/pages/DashboardPublic";
import Edukasi from "@/pages/Edukasi";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import AuthCallback from "@/pages/AuthCallback";
import Unauthorized from "@/pages/Unauthorized";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import CommunityReport from "@/pages/CommunityReport";
import WasteManagementSchedule from "@/pages/WasteManagementSchedule";
import ScheduleDetail from "@/pages/ScheduleDetail";
import WebGisAdmin from "@/pages/WebGisAdmin";
import EdukasiAdmin from "@/pages/EdukasiAdmin";

// New Pages
import Kolaborasi from "@/pages/Kolaborasi";
import BankSampah from "@/pages/BankSampah";
import BankSampahDetail from "./pages/BankSampahDetail";
import Pengaduan from "@/pages/Pengaduan";
import Logistik from "@/pages/Logistik";
import UsersAdmin from "@/pages/UsersAdmin";
import ManajemenPetugas from "@/pages/ManajemenPetugas";
import ManajemenTugas from "@/pages/ManajemenTugas";
import SettingsPage from "@/pages/SettingsPage";
import PelaporanPage from "@/pages/PelaporanPage";
import MonitoringRitase from "@/pages/MonitoringRitase";
import MonitoringKinerja from "@/pages/MonitoringKinerja";
import MonitoringSumberSampah from "@/pages/MonitoringSumberSampah";
import MonitoringEkonomiSirkular from "@/pages/MonitoringEkonomiSirkular";
import GisAnalytics from "@/pages/GisAnalytics"; // Import the new page
import { useEffect } from "react";

const queryClient = new QueryClient();


const App = () => {
  useEffect(() => {
    console.log('App mounted');
    return () => console.log('App unmounted');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>

              {/* Public Layout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/webgis" element={<WebGIS />} />
                <Route path="/dashboard-publik" element={<DashboardPublic />} />
                <Route path="/edukasi" element={<Edukasi />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/bank/:id" element={<BankSampahDetail />} />
              </Route>

              {/* Protected Layout */}
              <Route element={<ProtectedLayout />}>
                {/* Dashboard */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                {/* WebGIS */}
                <Route path="/webgis-admin/peta-monitoring" element={<ProtectedRoute><WebGisAdmin /></ProtectedRoute>} />
                <Route path="/webgis-admin/gis-analitik" element={<ProtectedRoute><GisAnalytics /></ProtectedRoute>} />
                {/* Monitoring */}
                <Route path="/monitoring/sumber-sampah" element={<ProtectedRoute><MonitoringSumberSampah /></ProtectedRoute>} />
                <Route path="/monitoring/ritase-kendaraan" element={<ProtectedRoute><MonitoringRitase /></ProtectedRoute>} />
                <Route path="/monitoring/kinerja-wilayah" element={<ProtectedRoute><MonitoringKinerja /></ProtectedRoute>} />
                <Route path="/monitoring/kinerja-fasilitas" element={<ProtectedRoute><MonitoringEkonomiSirkular /></ProtectedRoute>} />
                {/* Edukasi & Kampanye */}
                <Route path="/edukasi/konten" element={<ProtectedRoute><Edukasi /></ProtectedRoute>} />
                <Route path="/edukasi/statistik" element={<ProtectedRoute><EdukasiAdmin /></ProtectedRoute>} />
                {/* Kolaborasi */}
                <Route path="/kolaborasi/forum" element={<ProtectedRoute><Kolaborasi /></ProtectedRoute>} />
                <Route path="/kolaborasi/perpustakaan" element={<ProtectedRoute><Kolaborasi /></ProtectedRoute>} />
                {/* Bank Sampah */}
                <Route path="/bank-sampah/data" element={<ProtectedRoute><BankSampah /></ProtectedRoute>} />
                <Route path="/bank-sampah/tps3r" element={<ProtectedRoute><BankSampahDetail /></ProtectedRoute>} />
                {/* Manajemen */}
                <Route path="/manajemen/petugas" element={<ProtectedRoute><ManajemenPetugas /></ProtectedRoute>} />
                <Route path="/manajemen/tugas" element={<ProtectedRoute><ManajemenTugas /></ProtectedRoute>} />
                <Route path="/manajemen/armada-rute" element={<ProtectedRoute><Logistik /></ProtectedRoute>} />
                <Route path="/manajemen/pengguna" element={<ProtectedRoute allowedRoles={["admin"]}><UsersAdmin /></ProtectedRoute>} />
                {/* Pengaturan */}
                <Route path="/pengaturan/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/pengaturan/notifikasi" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/pengaturan/keamanan" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/pengaturan/tampilan" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
