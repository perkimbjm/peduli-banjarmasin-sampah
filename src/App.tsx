
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import WebGIS from "./pages/WebGIS";
import DashboardPublic from "./pages/DashboardPublic";
import Edukasi from "./pages/Edukasi";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import CommunityReport from "./pages/CommunityReport";
import WasteManagementSchedule from "./pages/WasteManagementSchedule";
import ScheduleDetail from "./pages/ScheduleDetail";
import { SidebarProvider } from "./components/ui/sidebar";

const queryClient = new useQueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/webgis" element={<WebGIS />} />
            <Route path="/dashboard-publik" element={<DashboardPublic />} />
            <Route path="/edukasi" element={<Edukasi />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes - accessible to all authenticated users */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Dashboard />
                  </SidebarProvider>
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
            
            {/* Role-based routes */}
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
                  <div>WebGIS Admin Placeholder</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edukasi-admin" 
              element={
                <ProtectedRoute allowedRoles={["admin", "leader", "stakeholder"]}>
                  <div>Manajemen Edukasi Placeholder</div>
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
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
