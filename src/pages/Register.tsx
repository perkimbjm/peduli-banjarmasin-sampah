
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Mail, Lock, User, AlertTriangle, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("volunteer");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (password !== confirmPassword) {
      setErrorMessage("Kata sandi tidak cocok. Silakan periksa kembali.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password, fullName, role);
      // Login will happen automatically, redirection will be handled by useEffect
    } catch (error: any) {
      setErrorMessage(error.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // OAuth redirect will happen, no need to navigate here
    } catch (error: any) {
      setErrorMessage(error.message || "Terjadi kesalahan saat mendaftar dengan Google.");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-peduli-600 dark:hover:text-peduli-400 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
        
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 bg-peduli-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">PS</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Buat Akun Baru</CardTitle>
            <CardDescription className="text-center">
              Daftar untuk mengakses fitur lengkap PeduliSampah
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-md p-3 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-600 dark:text-red-300">{errorMessage}</div>
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap"
                    className="pl-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon (opsional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nomor telepon"
                    className="pl-10"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Masukkan ulang kata sandi"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Daftar Sebagai</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="stakeholder">Stakeholder</SelectItem>
                    <SelectItem value="leader">Leader</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-peduli-600 hover:bg-peduli-700" disabled={isLoading}>
                {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
              </Button>
            </form>
            
            <div className="relative my-4">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white dark:bg-gray-800 px-2 text-xs text-gray-500 dark:text-gray-400">
                  ATAU
                </span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleRegister} 
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Daftar dengan Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600 dark:text-gray-400">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="text-peduli-600 dark:text-peduli-400 hover:underline font-medium">
                Masuk di sini
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
