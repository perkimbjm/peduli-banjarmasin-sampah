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
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPasswordBaru, setKonfirmasiPasswordBaru] = useState("");
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showKonfirmasiPasswordBaru, setShowKonfirmasiPasswordBaru] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have the required tokens for password reset
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    
    if (!accessToken || !refreshToken) {
      toast({
        variant: "destructive",
        title: "Token tidak valid",
        description: "Token reset password tidak valid atau sudah kedaluwarsa. Silakan minta link baru.",
      });
      navigate("/", { replace: true });
    }
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
    const passwordError = validatePassword(passwordBaru);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    // Check if passwords match
    if (passwordBaru !== konfirmasiPasswordBaru) {
      setErrorMessage("Password Baru dan Konfirmasi Password Baru tidak sama");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordBaru
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
                <Label htmlFor="passwordBaru">Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="passwordBaru"
                    type={showPasswordBaru ? "text" : "password"}
                    placeholder="Masukkan password baru"
                    className="pl-10 pr-10"
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPasswordBaru(!showPasswordBaru)}
                  >
                    {showPasswordBaru ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Password minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="konfirmasiPasswordBaru">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="konfirmasiPasswordBaru"
                    type={showKonfirmasiPasswordBaru ? "text" : "password"}
                    placeholder="Konfirmasi password baru"
                    className="pl-10 pr-10"
                    value={konfirmasiPasswordBaru}
                    onChange={(e) => setKonfirmasiPasswordBaru(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowKonfirmasiPasswordBaru(!showKonfirmasiPasswordBaru)}
                  >
                    {showKonfirmasiPasswordBaru ? <EyeOff /> : <Eye />}
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
