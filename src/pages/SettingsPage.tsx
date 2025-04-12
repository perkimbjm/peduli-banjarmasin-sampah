import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const profileFormSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  telepon: z.string().min(10, "Nomor telepon minimal 10 digit"),
});

const securityFormSchema = z.object({
  passwordLama: z.string().min(6, "Password minimal 6 karakter"),
  passwordBaru: z.string().min(6, "Password minimal 6 karakter"),
  konfirmasiPassword: z.string().min(6, "Password minimal 6 karakter"),
}).refine((data) => data.passwordBaru === data.konfirmasiPassword, {
  message: "Password baru dan konfirmasi password tidak sama",
  path: ["konfirmasiPassword"],
});

const SettingsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nama: user?.displayName || "",
      email: user?.email || "",
      telepon: user?.phoneNumber || "",
    },
  });

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      passwordLama: "",
      passwordBaru: "",
      konfirmasiPassword: "",
    },
  });

  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      // TODO: Implementasi update profil
      console.log(values);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const onSecuritySubmit = async (values: z.infer<typeof securityFormSchema>) => {
    try {
      // TODO: Implementasi update password
      console.log(values);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="notifikasi">Notifikasi</TabsTrigger>
          <TabsTrigger value="keamanan">Keamanan</TabsTrigger>
          <TabsTrigger value="tampilan">Tampilan</TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
              <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Ubah Foto</Button>
          </div>

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan email Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="telepon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nomor telepon Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Simpan Perubahan</Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="notifikasi" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">Notifikasi Email</h3>
                <p className="text-sm text-muted-foreground">
                  Terima notifikasi melalui email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">Notifikasi Push</h3>
                <p className="text-sm text-muted-foreground">
                  Terima notifikasi push di browser
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, push: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">Notifikasi SMS</h3>
                <p className="text-sm text-muted-foreground">
                  Terima notifikasi melalui SMS
                </p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, sms: checked })
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="keamanan" className="space-y-6">
          <Form {...securityForm}>
            <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
              <FormField
                control={securityForm.control}
                name="passwordLama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Lama</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Masukkan password lama" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={securityForm.control}
                name="passwordBaru"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Baru</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Masukkan password baru" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={securityForm.control}
                name="konfirmasiPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Konfirmasi password baru"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Ubah Password</Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="tampilan" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">Mode Gelap</h3>
                <p className="text-sm text-muted-foreground">
                  Aktifkan mode gelap untuk tampilan yang lebih nyaman di malam hari
                </p>
              </div>
              <Switch />
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Bahasa</h3>
              <Select defaultValue="id">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih bahasa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage; 