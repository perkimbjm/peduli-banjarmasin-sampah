
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Upload, MapPin, Camera } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const CommunityReport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ latitude: -6.2088, longitude: 106.8456 }); // Default to Jakarta
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // This query will be implemented when we have the reports table
  const { data: recentReports, isLoading } = useQuery({
    queryKey: ["recentReports"],
    queryFn: async () => {
      // Note: This would be replaced with actual implementation once we have the reports table
      return [];
    },
    enabled: !!user,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast({
        title: "Informasi tidak lengkap",
        description: "Judul dan deskripsi laporan harus diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // This will be implemented when we create the reports table and storage bucket
      toast({
        title: "Laporan berhasil dikirim",
        description: "Terima kasih atas partisipasi Anda",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setLocation({ latitude: -6.2088, longitude: 106.8456 });
      setUploadedImages([]);
    } catch (error: any) {
      toast({
        title: "Gagal mengirim laporan",
        description: error.message || "Terjadi kesalahan saat mengirim laporan",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // This will be implemented when we create the storage bucket for report images
    toast({
      title: "Fitur upload foto",
      description: "Fitur ini akan diimplementasikan setelah kita membuat bucket penyimpanan",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pelaporan Masyarakat</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Bantu kami dengan melaporkan masalah sampah di sekitar Anda
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Form Laporan */}
          <Card>
            <CardHeader>
              <CardTitle>Buat Laporan Baru</CardTitle>
              <CardDescription>
                Silakan isi detail laporan masalah sampah yang Anda temukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Laporan</Label>
                  <Input
                    id="title"
                    placeholder="Contoh: TPS liar di Jalan Sudirman"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan detil masalah sampah yang Anda temukan..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-32"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="Contoh: -6.2088"
                      value={location.latitude}
                      onChange={(e) => setLocation({...location, latitude: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="Contoh: 106.8456"
                      value={location.longitude}
                      onChange={(e) => setLocation({...location, longitude: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Upload Foto</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 text-center">
                    <Input
                      id="image"
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      multiple
                    />
                    <Label
                      htmlFor="image"
                      className="w-full cursor-pointer flex flex-col items-center justify-center py-4"
                    >
                      <Camera className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-gray-500">Klik untuk upload foto</span>
                      <span className="text-xs text-gray-400 mt-1">
                        (Support JPG, PNG. Maks 5MB)
                      </span>
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengirim laporan...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Kirim Laporan
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Mini Map & Recent Reports */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lokasi Laporan</CardTitle>
                <CardDescription>Drag marker untuk menentukan lokasi yang tepat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 dark:bg-gray-800 h-52 rounded-md flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-gray-500">
                    Peta akan ditampilkan di sini
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Koordinat: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Laporan Terakhir</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : recentReports && recentReports.length > 0 ? (
                  <div className="space-y-4">
                    {/* List of recent reports will be shown here */}
                    <p className="text-center text-gray-500">
                      Laporan akan ditampilkan di sini
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    Belum ada laporan yang dibuat
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityReport;
