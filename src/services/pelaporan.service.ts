import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export interface Pelaporan {
  id: string;
  jenis_laporan: string;
  deskripsi: string;
  lokasi: {
    lat: number;
    lng: number;
  };
  foto_url: string;
  status: "menunggu" | "proses" | "selesai" | "ditolak";
  created_at: string;
  updated_at: string;
  pelapor_id: string;
}

export interface CreatePelaporanDTO {
  jenis_laporan: string;
  deskripsi: string;
  lokasi: {
    lat: number;
    lng: number;
  };
  foto: File;
}

export const PelaporanService = {
  async create(data: CreatePelaporanDTO): Promise<Pelaporan> {
    try {
      // 1. Upload foto ke storage
      const fotoExt = data.foto.name.split(".").pop();
      const fotoPath = `pelaporan/${uuidv4()}.${fotoExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("public")
        .upload(fotoPath, data.foto);

      if (uploadError) throw uploadError;

      // 2. Dapatkan URL foto
      const { data: { publicUrl: fotoUrl } } = supabase.storage
        .from("public")
        .getPublicUrl(fotoPath);

      // 3. Ekstrak metadata EXIF untuk geotagging
      const exifData = await this.extractExifData(data.foto);
      const geoLocation = exifData?.gps || data.lokasi;

      // 4. Simpan data pelaporan
      const { data: pelaporan, error } = await supabase
        .from("pelaporan")
        .insert({
          jenis_laporan: data.jenis_laporan,
          deskripsi: data.deskripsi,
          lokasi: geoLocation,
          foto_url: fotoUrl,
          status: "menunggu",
          pelapor_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // 5. Buat pengaduan terkait
      await supabase
        .from("pengaduan")
        .insert({
          pelaporan_id: pelaporan.id,
          status: "menunggu",
          jenis: "pelaporan_masyarakat",
          deskripsi: data.deskripsi,
        });

      return pelaporan;
    } catch (error) {
      console.error("Error creating pelaporan:", error);
      throw error;
    }
  },

  async extractExifData(file: File) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // @ts-ignore
          const exif = await import("exif-js");
          const tags = exif.readFromBinaryFile(e.target?.result);
          
          if (tags?.GPSLatitude && tags?.GPSLongitude) {
            const lat = this.convertDMSToDD(
              tags.GPSLatitude[0],
              tags.GPSLatitude[1],
              tags.GPSLatitude[2],
              tags.GPSLatitudeRef
            );
            
            const lng = this.convertDMSToDD(
              tags.GPSLongitude[0],
              tags.GPSLongitude[1],
              tags.GPSLongitude[2],
              tags.GPSLongitudeRef
            );

            resolve({ gps: { lat, lng } });
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error("Error extracting EXIF:", error);
          resolve(null);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  },

  convertDMSToDD(degrees: number, minutes: number, seconds: number, direction: string) {
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (direction === "S" || direction === "W") dd = dd * -1;
    return dd;
  },

  async getAll(): Promise<Pelaporan[]> {
    const { data, error } = await supabase
      .from("pelaporan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Pelaporan> {
    const { data, error } = await supabase
      .from("pelaporan")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: Pelaporan["status"]) {
    const { error } = await supabase
      .from("pelaporan")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }
}; 