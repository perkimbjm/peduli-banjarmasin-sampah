
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
import MonitoringEkonomiSirkular from "@/pages/MonitoringEkonomiSirkular"; // Import the new page

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>

            {/* Public Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/webgis" element={<WebGIS />} />
              <Route path="/dashboard-publik" element={<DashboardPublic />} />
              <Route path="/edukasi" element={<Edukasi />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/bank/:id" element={<BankSampahDetail />} />
            </Route>

            {/* Protected Layout */}
            <Route element={<ProtectedLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/laporan"
                element={
                  <ProtectedRoute>
                    <CommunityReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jadwal"
                element={
                  <ProtectedRoute>
                    <WasteManagementSchedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jadwal/:id"
                element={
                  <ProtectedRoute>
                    <ScheduleDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/webgis-admin"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <WebGisAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edukasi-admin"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <EdukasiAdmin />
                  </ProtectedRoute>
                }
              />
              {/* Route for Monitoring Ritase */}
              <Route
                path="/monitoring-ritase"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <MonitoringRitase />
                  </ProtectedRoute>
                }
              />
              {/* Route for Monitoring Kinerja */}
              <Route
                path="/monitoring-kinerja"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <MonitoringKinerja />
                  </ProtectedRoute>
                }
              />
              {/* Route for Monitoring Sumber Sampah */}
              <Route
                path="/monitoring-sumber-sampah"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <MonitoringSumberSampah />
                  </ProtectedRoute>
                }
              />
              {/* New Route for Monitoring Ekonomi Sirkular */}
              <Route
                path="/monitoring-ekonomi-sirkular"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <MonitoringEkonomiSirkular />
                  </ProtectedRoute>
                }
              />
              {/* New Routes */}
              <Route
                path="/kolaborasi"
                element={
                  <ProtectedRoute>
                    <Kolaborasi />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bank-sampah"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <BankSampah />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pengaduan"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <Pengaduan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logistik"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <Logistik />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UsersAdmin />
                  </ProtectedRoute>
                }
              />
              {/* New Management Routes */}
              <Route
                path="/petugas"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <ManajemenPetugas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tugas"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <ManajemenTugas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard-admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pelaporan"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <PelaporanPage/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
