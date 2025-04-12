export type Schedule = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  waste_type?: string;
  expected_volume?: number;
  actual_volume?: number;
  status?: string;
};

export type Participant = {
  id: string;
  schedule_id: string;
  user_id: string;
  status: "pending" | "confirmed" | "declined";
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string | null;
    email: string;
  } | null;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pelaporan: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          jenis_laporan: string
          deskripsi: string
          lokasi: {
            lat: number
            lng: number
          }
          foto_url: string
          status: "menunggu" | "proses" | "selesai" | "ditolak"
          pelapor_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          jenis_laporan: string
          deskripsi: string
          lokasi: {
            lat: number
            lng: number
          }
          foto_url: string
          status?: "menunggu" | "proses" | "selesai" | "ditolak"
          pelapor_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          jenis_laporan?: string
          deskripsi?: string
          lokasi?: {
            lat: number
            lng: number
          }
          foto_url?: string
          status?: "menunggu" | "proses" | "selesai" | "ditolak"
          pelapor_id?: string
        }
      }
      pengaduan: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          pelaporan_id: string
          status: "menunggu" | "proses" | "selesai" | "ditolak"
          jenis: string
          deskripsi: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          pelaporan_id: string
          status?: "menunggu" | "proses" | "selesai" | "ditolak"
          jenis: string
          deskripsi: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          pelaporan_id?: string
          status?: "menunggu" | "proses" | "selesai" | "ditolak"
          jenis?: string
          deskripsi?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
