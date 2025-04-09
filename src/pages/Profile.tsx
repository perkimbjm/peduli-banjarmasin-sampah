
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: user?.email || "",
    phoneNumber: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, phone_number")
          .eq("id", user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfile({
            fullName: data.full_name || "",
            email: user.email || "",
            phoneNumber: data.phone_number || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.fullName,
          phone_number: profile.phoneNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profil diperbarui",
        description: "Informasi profil Anda berhasil diperbarui.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal memperbarui profil",
        description: error.message || "Terjadi kesalahan saat memperbarui profil.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Kata sandi tidak cocok",
        description: "Kata sandi baru dan konfirmasi kata sandi harus sama.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      // Clear password fields
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast({
        title: "Kata sandi diperbarui",
        description: "Kata sandi Anda berhasil diperbarui.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal memperbarui kata sandi",
        description: error.message || "Terjadi kesalahan saat memperbarui kata sandi.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Pengguna</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Kelola informasi profil dan pengaturan akun Anda
          </p>
        </div>
        
        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Keamanan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>
                    Perbarui informasi profil pribadi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-2xl bg-peduli-600 text-white">
                        {profile.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <h3 className="font-medium text-lg">{profile.fullName || user?.email?.split('@')[0]}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Nama Lengkap</Label>
                      <Input
                        id="fullName"
                        placeholder="Nama lengkap"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="Nomor telepon"
                        value={profile.phoneNumber}
                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleUpdateProfile} disabled={isLoading}>
                    {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Ubah Kata Sandi</CardTitle>
                <CardDescription>
                  Perbarui kata sandi akun Anda untuk keamanan yang lebih baik
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleUpdatePassword} disabled={isLoading}>
                  {isLoading ? "Memperbarui..." : "Perbarui Kata Sandi"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
