
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface Report {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: "pending" | "processing" | "resolved" | "rejected";
  created_at: string;
  updated_at: string;
  user_id: string;
  resolver_id?: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export interface CreateReportDTO {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  images?: File[];
}

export const ReportsService = {
  async create(data: CreateReportDTO): Promise<Report> {
    try {
      // Validate coordinates using the new validation function
      const { data: isValidCoords } = await supabase.rpc('validate_coordinates', {
        lat: data.latitude,
        lng: data.longitude
      });

      if (!isValidCoords) {
        throw new Error('Invalid coordinates provided');
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Create the report
      const { data: report, error } = await supabase
        .from("reports")
        .insert({
          title: data.title,
          description: data.description,
          latitude: data.latitude,
          longitude: data.longitude,
          status: "pending",
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Upload images if provided
      if (data.images && data.images.length > 0) {
        for (const image of data.images) {
          await this.uploadReportImage(report.id, image, user.id);
        }
      }

      return report;
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  },

  async uploadReportImage(reportId: string, file: File, userId: string): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/${reportId}/${uuidv4()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Save image record
    const { error: dbError } = await supabase
      .from("report_images")
      .insert({
        report_id: reportId,
        storage_path: filePath,
      });

    if (dbError) throw dbError;

    return filePath;
  },

  async getAll(): Promise<Report[]> {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Report> {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: Report["status"], resolutionNotes?: string) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('User not authenticated');

    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };

    if (status === "resolved") {
      updateData.resolved_at = new Date().toISOString();
      updateData.resolver_id = user.id;
      if (resolutionNotes) {
        updateData.resolution_notes = resolutionNotes;
      }
    }

    const { error } = await supabase
      .from("reports")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};
