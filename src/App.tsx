
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Edukasi from "@/pages/Edukasi";
import BankSampah from "@/pages/BankSampah";
import BankSampahDetail from "@/pages/BankSampahDetail";
import Kolaborasi from "@/pages/Kolaborasi";
import PelaporanPage from "@/pages/PelaporanPage";
import Pengaduan from "@/pages/Pengaduan";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import DashboardPublic from "@/pages/DashboardPublic";
import Dashboard from "@/pages/Dashboard";
import EdukasiAdmin from "@/pages/EdukasiAdmin";
import WebGIS from "@/pages/WebGIS";
import WebGisAdmin from "@/pages/WebGisAdmin";
import MonitoringKinerja from "@/pages/MonitoringKinerja";
import MonitoringSumberSampah from "@/pages/MonitoringSumberSampah";
import MonitoringEkonomiSirkular from "@/pages/MonitoringEkonomiSirkular";
import MonitoringRitase from "@/pages/MonitoringRitase";
import GisAnalytics from "@/pages/GisAnalytics";
import ManajemenPetugas from "@/pages/ManajemenPetugas";
import ManajemenTugas from "@/pages/ManajemenTugas";
import UsersAdmin from "@/pages/UsersAdmin";
import Logistik from "@/pages/Logistik";
import SettingsPage from "@/pages/SettingsPage";
import Profile from "@/pages/Profile";
import WasteManagementSchedule from "@/pages/WasteManagementSchedule";
import ScheduleDetail from "@/pages/ScheduleDetail";
import CommunityReport from "@/pages/CommunityReport";
import ProtectedRoute from "@/components/ProtectedRoute";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import AuthCallback from "@/pages/AuthCallback";
import ResetPassword from "@/pages/ResetPassword";
import PerpustakaanDigital from "@/pages/PerpustakaanDigital";
import ManajemenKonten from "@/pages/ManajemenKonten";
import EdukasiStatistik from "@/pages/EdukasiStatistik";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/edukasi" element={<Edukasi />} />
        <Route path="/edukasi/statistik" element={<EdukasiStatistik />} />
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="education" element={<EdukasiAdmin />} />
                <Route path="education/konten" element={<ManajemenKonten />} />
                <Route path="education/statistik" element={<EdukasiStatistik />} />
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
            <ProtectedRoute>
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
