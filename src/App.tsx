
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';
import PublicLayout from './components/layouts/PublicLayout';
import ProtectedLayout from './components/layouts/ProtectedLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';
import BankSampah from './pages/BankSampah';
import BankSampahDetail from './pages/BankSampahDetail';
import Edukasi from './pages/Edukasi';
import EdukasiDetail from './pages/EdukasiDetail';
import DashboardPublic from './pages/DashboardPublic';
import Kolaborasi from './pages/Kolaborasi';
import PelaporanPage from './pages/PelaporanPage';
import CommunityReport from './pages/CommunityReport';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SettingsPage from './pages/SettingsPage';
import WebGIS from './pages/WebGIS';
import WebGisAdmin from './pages/WebGisAdmin';
import Pengaduan from './pages/Pengaduan';
import WasteManagementSchedule from './pages/WasteManagementSchedule';
import ScheduleDetail from './pages/ScheduleDetail';
import ManajemenPetugas from './pages/ManajemenPetugas';
import ManajemenTugas from './pages/ManajemenTugas';
import EdukasiAdmin from './pages/EdukasiAdmin';
import UsersAdmin from './pages/UsersAdmin';
import MonitoringSumberSampah from './pages/MonitoringSumberSampah';
import MonitoringRitase from './pages/MonitoringRitase';
import MonitoringKinerja from './pages/MonitoringKinerja';
import MonitoringEkonomiSirkular from './pages/MonitoringEkonomiSirkular';
import Logistik from './pages/Logistik';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/bank-sampah" element={<BankSampah />} />
          <Route path="/bank-sampah/:id" element={<BankSampahDetail />} />
          <Route path="/edukasi" element={<Edukasi />} />
          <Route path="/edukasi/:id" element={<EdukasiDetail />} />
          <Route path="/data" element={<DashboardPublic />} />
          <Route path="/kolaborasi" element={<Kolaborasi />} />
          <Route path="/pelaporan" element={<PelaporanPage />} />
          <Route path="/community-report" element={<CommunityReport />} />
        </Route>

        {/* Protected Routes / Dashboard */}
        <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
          <Route path="/webgis" element={<DashboardLayout><WebGIS /></DashboardLayout>} />
          <Route path="/webgis-admin" element={<DashboardLayout><WebGisAdmin /></DashboardLayout>} />
          <Route path="/pengaduan" element={<DashboardLayout><Pengaduan /></DashboardLayout>} />
          <Route path="/jadwal" element={<DashboardLayout><WasteManagementSchedule /></DashboardLayout>} />
          <Route path="/jadwal/:id" element={<DashboardLayout><ScheduleDetail /></DashboardLayout>} />
          <Route path="/manajemen-petugas" element={<DashboardLayout><ManajemenPetugas /></DashboardLayout>} />
          <Route path="/manajemen-tugas" element={<DashboardLayout><ManajemenTugas /></DashboardLayout>} />
          <Route path="/edukasi-admin" element={<DashboardLayout><EdukasiAdmin /></DashboardLayout>} />
          <Route path="/users-admin" element={<DashboardLayout><UsersAdmin /></DashboardLayout>} />
          <Route path="/monitoring-sumber-sampah" element={<DashboardLayout><MonitoringSumberSampah /></DashboardLayout>} />
          <Route path="/monitoring-ritase" element={<DashboardLayout><MonitoringRitase /></DashboardLayout>} />
          <Route path="/monitoring-kinerja" element={<DashboardLayout><MonitoringKinerja /></DashboardLayout>} />
          <Route path="/monitoring-ekonomi-sirkular" element={<DashboardLayout><MonitoringEkonomiSirkular /></DashboardLayout>} />
          <Route path="/logistik" element={<DashboardLayout><Logistik /></DashboardLayout>} />
        </Route>

        {/* Not Found */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
