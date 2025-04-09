
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Upload, Camera, MapPinned } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type FormValues = {
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  images: FileList;
};

const CommunityReport = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Anda harus login",
        description: "Silakan login terlebih dahulu untuk mengirimkan laporan",
      });
      return;
    }

    setLoading(true);

    try {
      // Create the report entry in the database
      const { error } = await supabase
        .from('reports')
        .insert({
          title: data.title,
          description: data.description,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Laporan berhasil dikirim",
        description: "Terima kasih atas kontribusi Anda!",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal mengirim laporan",
        description: error.message || "Terjadi kesalahan saat mengirim laporan",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude.toString());
          setValue('longitude', position.coords.longitude.toString());
          
          toast({
            title: "Lokasi ditemukan",
            description: `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`,
          });
        },
        () => {
          toast({
            variant: "destructive",
            title: "Gagal mendapatkan lokasi",
            description: "Pastikan Anda memberikan izin lokasi",
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolokasi tidak didukung",
        description: "Browser Anda tidak mendukung geolokasi",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Masyarakat</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Laporkan TPS liar, pembuangan ilegal, atau masalah sampah lainnya
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formulir Laporan</CardTitle>
            <CardDescription>
              Isi detail laporan dengan lengkap dan akurat
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Laporan</Label>
                <Input
                  id="title"
                  placeholder="Contoh: TPS liar di Jalan Merdeka"
                  {...register('title', { required: "Judul laporan wajib diisi" })}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsikan masalah yang Anda temui secara detail"
                  className="min-h-[120px]"
                  {...register('description', { required: "Deskripsi wajib diisi" })}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="latitude"
                      placeholder="Contoh: -6.175110"
                      {...register('latitude', { 
                        required: "Latitude wajib diisi",
                        pattern: {
                          value: /^-?\d+(\.\d+)?$/,
                          message: "Format latitude tidak valid"
                        }
                      })}
                    />
                    <Button type="button" variant="outline" onClick={getCurrentLocation}>
                      <MapPin className="h-4 w-4 mr-2" /> Lokasi Saya
                    </Button>
                  </div>
                  {errors.latitude && (
                    <p className="text-sm text-red-500">{errors.latitude.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="Contoh: 106.827153"
                    {...register('longitude', { 
                      required: "Longitude wajib diisi",
                      pattern: {
                        value: /^-?\d+(\.\d+)?$/,
                        message: "Format longitude tidak valid"
                      }
                    })}
                  />
                  {errors.longitude && (
                    <p className="text-sm text-red-500">{errors.longitude.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Unggah Foto</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-center h-48 w-full border-2 border-dashed rounded-md border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors relative">
                      <input
                        type="file"
                        id="images"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        {...register('images')}
                        onChange={handleImageChange}
                      />
                      <div className="flex flex-col items-center">
                        <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Klik atau jatuhkan foto di sini
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {preview ? (
                      <div className="relative h-48 w-full overflow-hidden rounded-md">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => setPreview(null)}
                        >
                          <span className="sr-only">Hapus</span>
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 w-full border-2 border-dashed rounded-md border-gray-300 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Pratinjau foto akan muncul di sini
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPinned className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-sm">Peta Interaktif</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Fitur peta interaktif dengan marker drag & drop akan segera hadir. 
                  Untuk saat ini, silakan masukkan koordinat secara manual atau gunakan tombol "Lokasi Saya".
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-6">
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Mengirim..." : "Kirim Laporan"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CommunityReport;
