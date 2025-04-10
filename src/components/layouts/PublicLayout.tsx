// src/layouts/PublicLayout.tsx
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Optional: Header / Footer di sini */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
