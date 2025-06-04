
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the URL hash for token-based authentication
      const hash = window.location.hash;
      
      if (hash) {
        const hashParams = new URLSearchParams(hash.substring(1));
        const type = hashParams.get("type");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        console.log('AuthCallback - Hash params:', { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });

        // Handle password recovery
        if (type === "recovery" && accessToken && refreshToken) {
          console.log('AuthCallback - Redirecting to reset password');
          navigate(`/reset-password${hash}`, { replace: true });
          return;
        }

        // Handle other auth callbacks (login, signup, etc.)
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error during OAuth callback:", error);
            navigate("/login", { replace: true });
          } else if (data?.session) {
            console.log('AuthCallback - Session found, redirecting to dashboard');
            navigate("/dashboard", { replace: true });
          } else {
            console.log('AuthCallback - No session, redirecting to login');
            navigate("/login", { replace: true });
          }
        } catch (error) {
          console.error("Unexpected error in auth callback:", error);
          navigate("/login", { replace: true });
        }
      } else {
        console.log('AuthCallback - No hash, redirecting to login');
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
