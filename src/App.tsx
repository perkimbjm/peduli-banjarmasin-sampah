
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
              <Route
                path="/kolaborasi"
                element={
                  <ProtectedRoute>
                    <div>Portal Kolaborasi Placeholder</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bank-sampah"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <div>Manajemen Bank Sampah Placeholder</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logistik"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <div>Manajemen Logistik Placeholder</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pengaduan"
                element={
                  <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                    <div>Manajemen Pengaduan Placeholder</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <div>Manajemen User Placeholder</div>
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
