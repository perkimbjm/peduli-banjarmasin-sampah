import { useState, Suspense, lazy } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Loader2, Map } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PelaporanService, type CreatePelaporanDTO } from "@/services/pelaporan.service";
import { useNavigate } from "react-router-dom";

// Lazy load map components to avoid Context issues
const MapComponent = lazy(() => import("@/components/MapPelaporan"));

const formSchema = z.object({
  jenisLaporan: z.string().min(1, "Jenis laporan harus dipilih"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  lokasi: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  foto: z.any(),
});

const PelaporanPage = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: -3.3192, lng: 114.5911 }); // Default Banjarmasin
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenisLaporan: "",
      deskripsi: "",
      lokasi: { lat: -3.3192, lng: 114.5911 }, // Default location: Banjarmasin
      foto: null,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("foto", file);
      
      // Preview foto
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Coba ekstrak koordinat dari EXIF
      try {
        const exifData = await PelaporanService.extractExifData(file);
        if (exifData && typeof exifData === 'object' && 'gps' in exifData && 
            exifData.gps && typeof exifData.gps === 'object' && 
            'lat' in exifData.gps && 'lng' in exifData.gps) {
          const gpsData = exifData.gps as { lat: number; lng: number };
          setLocation(gpsData);
          form.setValue("lokasi", gpsData);
        }
      } catch (error) {
        console.error("Error extracting EXIF data:", error);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const pelaporanData: CreatePelaporanDTO = {
        jenis_laporan: values.jenisLaporan,
        deskripsi: values.deskripsi,
        lokasi: {
          lat: values.lokasi.lat || location.lat,
          lng: values.lokasi.lng || location.lng
        },
        foto: values.foto,
      };

      await PelaporanService.create(pelaporanData);

      toast({
        title: "Berhasil",
        description: "Laporan Anda telah berhasil dikirim dan akan segera diproses.",
      });

      navigate("/pengaduan");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationChange = (newLocation: { lat: number; lng: number }) => {
    setLocation(newLocation);
    form.setValue("lokasi", newLocation);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pelaporan Masyarakat</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="jenisLaporan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Laporan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis laporan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tps_liar">TPS Liar</SelectItem>
                    <SelectItem value="pembuangan_ilegal">Pembuangan Sembarangan / Ilegal</SelectItem>
                    <SelectItem value="pengangkutan_lama">Sampah Terlalu Lama Tidak Diangkut</SelectItem>
                    <SelectItem value="berserakan">Sampah berserakan setelah event atau hari libur</SelectItem>
                    <SelectItem value="penumpukan">Penumpukan Sampah di Tempat Umum</SelectItem>
                    <SelectItem value="pembakaran">Terjadi Pembakaran Sampah oleh Oknum</SelectItem>
                    <SelectItem value="edukasi">Perlu Edukasi Pemilahan di Masyarakat</SelectItem>
                    <SelectItem value="lainnya">Pelanggaran Lainnya terkait Sampah</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deskripsi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Laporan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Jelaskan masalah yang Anda temukan..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="foto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="foto"
                    />
                    <label
                      htmlFor="foto"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
                    >
                      <Camera className="h-5 w-5" />
                      <span>Upload Foto</span>
                    </label>
                  </div>
                </FormControl>
                {preview && (
                  <div className="mt-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-xs rounded-lg"
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Lokasi</FormLabel>
            <div className="h-[300px] w-full rounded-lg overflow-hidden bg-muted">
              <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <MapComponent 
                  location={location} 
                  onLocationChange={handleLocationChange} 
                />
              </Suspense>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lokasi.lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                          setLocation(prev => ({ ...prev, lat: value }));
                        }}
                        value={location.lat}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lokasi.lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                          setLocation(prev => ({ ...prev, lng: value }));
                        }}
                        value={location.lng}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>


          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Laporan"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PelaporanPage; 