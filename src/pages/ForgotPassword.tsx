
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { ArrowLeft, Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getRedirectUrl } from "@/utils/environment";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const redirectTo = getRedirectUrl("/reset-password");
      console.log('Redirect URL untuk reset password:', redirectTo);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast({
        title: "Email terkirim",
        description: "Link reset password telah dikirim ke email Anda",
      });
    } catch (error: any) {
      setErrorMessage(error.message || "Terjadi kesalahan saat mengirim email reset password");
      toast({
        variant: "destructive",
        title: "Gagal mengirim email",
        description: error.message || "Terjadi kesalahan saat mengirim email reset password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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
                <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Email Terkirim</CardTitle>
              <CardDescription className="text-center">
                Link reset password telah dikirim ke <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-900 rounded-md p-4">
                <div className="text-sm text-blue-600 dark:text-blue-300">
                  <p className="mb-2">Silakan periksa email Anda dan klik link yang telah dikirim untuk reset password.</p>
                  <p>Jika tidak menemukan email, periksa folder spam atau junk mail.</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  variant="outline" 
                  className="w-full"
                >
                  Kirim Ulang Email
                </Button>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    Kembali ke Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <CardTitle className="text-2xl text-center">Lupa Kata Sandi</CardTitle>
            <CardDescription className="text-center">
              Masukkan email Anda untuk menerima link reset password
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
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-peduli-600 hover:bg-peduli-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}
              </Button>
            </form>
            
            <div className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Ingat password Anda?{' '}
                <Link to="/login" className="text-peduli-600 dark:text-peduli-400 hover:underline font-medium">
                  Masuk sekarang
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
