
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Upload, MapPin, Camera, AlertCircle, Clock, Check, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from 'uuid';

type Report = {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'processing' | 'resolved' | 'rejected';
  created_at: string;
  updated_at: string;
  user_id: string;
};

const CommunityReport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ latitude: -6.2088, longitude: 106.8456 }); // Default to Jakarta
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadedImagePreviews, setUploadedImagePreviews] = useState<string[]>([]);

  // Fetch recent reports
  const { data: recentReports, isLoading } = useQuery({
    queryKey: ["recentReports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as Report[];
    },
    enabled: !!user,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Autentikasi diperlukan",
        description: "Anda harus login terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

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
      
      // Insert the report
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          title,
          description,
          latitude: location.latitude,
          longitude: location.longitude,
        })
        .select()
        .single();
        
      if (reportError) throw reportError;
      
      // Upload images if there are any
      if (selectedImages.length > 0) {
        const reportId = reportData.id;
        
        for (const imageFile of selectedImages) {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
          const filePath = `${fileName}`;
          
          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('report_images')
            .upload(filePath, imageFile);
            
          if (uploadError) throw uploadError;
          
          // Save reference in the database
          const { error: imageRefError } = await supabase
            .from('report_images')
            .insert({
              report_id: reportId,
              storage_path: filePath,
            });
            
          if (imageRefError) throw imageRefError;
        }
      }
      
      toast({
        title: "Laporan berhasil dikirim",
        description: "Terima kasih atas partisipasi Anda",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setLocation({ latitude: -6.2088, longitude: 106.8456 });
      setSelectedImages([]);
      setUploadedImagePreviews([]);
      
      // Refresh the reports list
      queryClient.invalidateQueries({ queryKey: ["recentReports"] });
      
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "Gagal mengirim laporan",
        description: error.message || "Terjadi kesalahan saat mengirim laporan",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Filter for images only and check file size
      const validFiles = files.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
        
        if (!isImage) {
          toast({
            title: "Format file tidak didukung",
            description: "Hanya file gambar yang diizinkan (JPG, PNG, etc.)",
            variant: "destructive",
          });
        } else if (!isValidSize) {
          toast({
            title: "Ukuran file terlalu besar",
            description: "Ukuran file maksimal adalah 5MB",
            variant: "destructive",
          });
        }
        
        return isImage && isValidSize;
      });
      
      if (validFiles.length > 0) {
        setSelectedImages(prev => [...prev, ...validFiles]);
        
        // Create previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setUploadedImagePreviews(prev => [...prev, ...newPreviews]);
      }
    }
  };

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(uploadedImagePreviews[index]);
    
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setUploadedImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Status badge styling
  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Menunggu</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Diproses</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Selesai</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ditolak</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
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
                  
                  {/* Display image previews */}
                  {uploadedImagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {uploadedImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                    Peta akan diintegrasikan setelah implementasi WebGIS
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Judul</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tanggal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.title}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell className="text-right">{format(new Date(report.created_at), 'dd/MM/yyyy')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      Belum ada laporan yang dibuat
                    </p>
                  </div>
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
