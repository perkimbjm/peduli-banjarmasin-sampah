
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processAuthTokens = async () => {
      // Check URL hash fragment first (from email link)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const tokenType = hashParams.get("token_type");
      const type = hashParams.get("type");

      console.log('Hash params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

      // Also check search params as fallback
      const searchAccessToken = searchParams.get("access_token");
      const searchRefreshToken = searchParams.get("refresh_token");
      const searchType = searchParams.get("type");

      console.log('Search params:', { accessToken: !!searchAccessToken, refreshToken: !!searchRefreshToken, type: searchType });

      const finalAccessToken = accessToken || searchAccessToken;
      const finalRefreshToken = refreshToken || searchRefreshToken;
      const finalType = type || searchType;

      if (!finalAccessToken || !finalRefreshToken || finalType !== "recovery") {
        console.error('Missing or invalid tokens:', { 
          hasAccessToken: !!finalAccessToken, 
          hasRefreshToken: !!finalRefreshToken, 
          type: finalType 
        });
        
        toast({
          variant: "destructive",
          title: "Link tidak valid",
          description: "Link reset password tidak valid atau sudah kedaluwarsa",
        });
        navigate("/forgot-password");
        return;
      }

      try {
        // Set the session using the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token: finalAccessToken,
          refresh_token: finalRefreshToken,
        });

        if (error) {
          console.error('Error setting session:', error);
          throw error;
        }

        console.log('Session set successfully:', !!data.session);
        
        // Clear the URL hash to clean up the URL
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch (error: any) {
        console.error('Session error:', error);
        toast({
          variant: "destructive",
          title: "Link tidak valid",
          description: "Link reset password tidak valid atau sudah kedaluwarsa",
        });
        navigate("/forgot-password");
      }
    };

    processAuthTokens();
  }, [searchParams, navigate, toast]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password minimal 8 karakter";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password harus mengandung huruf kecil";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password harus mengandung huruf besar";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password harus mengandung angka";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak sama");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password berhasil diubah",
        description: "Password Anda telah berhasil diubah. Silakan login dengan password baru",
      });

      // Sign out user after successful password reset
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      console.error('Update password error:', error);
      setErrorMessage(error.message || "Terjadi kesalahan saat mengubah password");
      toast({
        variant: "destructive",
        title: "Gagal mengubah password",
        description: error.message || "Terjadi kesalahan saat mengubah password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <Link to="/login" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-peduli-600 dark:hover:text-peduli-400 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Login
          </Link>
        </div>
        
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 bg-peduli-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">PS</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Buat Password Baru</CardTitle>
            <CardDescription className="text-center">
              Masukkan password baru untuk akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-md p-3 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-600 dark:text-red-300">{errorMessage}</div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Masukkan password baru"
                    className="pl-10 pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Password minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi password baru"
                    className="pl-10 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-peduli-600 hover:bg-peduli-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Mengubah Password...' : 'Ubah Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
