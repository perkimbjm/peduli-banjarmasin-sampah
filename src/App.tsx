import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Edukasi from "@/pages/Edukasi";
import BankSampah from "@/pages/BankSampah";
import BankSampahDetail from "@/pages/BankSampahDetail";
import Kolaborasi from "@/pages/Kolaborasi";
import PelaporanPage from "@/pages/PelaporanPage";
import Pengaduan from "@/pages/Pengaduan";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import DashboardPublic from "@/pages/DashboardPublic";
import Dashboard from "@/pages/admin/Dashboard";
import EdukasiAdmin from "@/pages/EdukasiAdmin";
import WebGIS from "@/pages/admin/WebGIS";
import WebGisAdmin from "@/pages/WebGisAdmin";
import MonitoringKinerja from "@/pages/admin/MonitoringKinerja";
import MonitoringSumberSampah from "@/pages/admin/MonitoringSumberSampah";
import MonitoringEkonomiSirkular from "@/pages/admin/MonitoringEkonomiSirkular";
import MonitoringRitase from "@/pages/admin/MonitoringRitase";
import GisAnalytics from "@/pages/admin/GisAnalytics";
import ManajemenPetugas from "@/pages/admin/ManajemenPetugas";
import ManajemenTugas from "@/pages/admin/ManajemenTugas";
import UsersAdmin from "@/pages/admin/UsersAdmin";
import Logistik from "@/pages/admin/Logistik";
import SettingsPage from "@/pages/admin/SettingsPage";
import Profile from "@/pages/Profile";
import WasteManagementSchedule from "@/pages/staff/WasteManagementSchedule";
import ScheduleDetail from "@/pages/staff/ScheduleDetail";
import CommunityReport from "@/pages/staff/CommunityReport";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicLayout from "@/components/layouts/PublicLayout";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import AuthCallback from "@/pages/auth/AuthCallback";
import ResetPassword from "@/pages/auth/ResetPassword";
import ThemeInitializer from "@/components/ThemeInitializer";
import PerpustakaanDigital from "@/pages/PerpustakaanDigital.tsx";
import ManajemenKonten from "@/pages/ManajemenKonten.tsx";

function App() {
  return (
    <Router>
      <ThemeInitializer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/edukasi" element={<Edukasi />} />
        <Route path="/bank-sampah" element={<BankSampah />} />
        <Route path="/bank-sampah/:id" element={<BankSampahDetail />} />
        <Route path="/kolaborasi" element={<Kolaborasi />} />
        <Route path="/kolaborasi/perpustakaan" element={<PerpustakaanDigital />} />
        <Route path="/pelaporan" element={<PelaporanPage />} />
        <Route path="/pengaduan" element={<Pengaduan />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardPublic />} />
        
        {/* Authentication routes */}
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicLayout>
              <ForgotPassword />
            </PublicLayout>
          }
        />

        {/* Protected Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="edukasi" element={<EdukasiAdmin />} />
                <Route path="edukasi/konten" element={<ManajemenKonten />} />
                <Route path="webgis" element={<WebGIS />} />
                <Route path="webgis-admin" element={<WebGisAdmin />} />
                <Route path="monitoring/kinerja" element={<MonitoringKinerja />} />
                <Route path="monitoring/sumber-sampah" element={<MonitoringSumberSampah />} />
                <Route path="monitoring/ekonomi-sirkular" element={<MonitoringEkonomiSirkular />} />
                <Route path="monitoring/ritase" element={<MonitoringRitase />} />
                <Route path="gis-analytics" element={<GisAnalytics />} />
                <Route path="manajemen/petugas" element={<ManajemenPetugas />} />
                <Route path="manajemen/tugas" element={<ManajemenTugas />} />
                <Route path="users" element={<UsersAdmin />} />
                <Route path="logistik" element={<Logistik />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Protected Staff routes */}
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute requiredRole="staff">
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="schedule" element={<WasteManagementSchedule />} />
                <Route path="schedule/:id" element={<ScheduleDetail />} />
                <Route path="community-report" element={<CommunityReport />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Error routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
