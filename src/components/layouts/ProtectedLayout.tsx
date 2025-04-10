// src/layouts/ProtectedLayout.tsx
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar"; // kalau ada komponen Sidebar

const ProtectedLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
