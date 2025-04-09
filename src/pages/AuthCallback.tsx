
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the URL hash
      const hash = window.location.hash;
      
      if (hash) {
        // Handle any OAuth callbacks
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error during OAuth callback:", error);
          navigate("/login", { replace: true });
        } else if (data?.session) {
          navigate("/dashboard", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Sedang memproses...</h2>
        <p className="text-gray-600 dark:text-gray-300">Mohon tunggu sementara kami menyelesaikan autentikasi Anda.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
