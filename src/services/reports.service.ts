import { supabase } from "@/lib/supabase";
import { Report } from "@/types";

export interface CreateReportRequest {
  latitude: number;
  longitude: number;
  description: string;
  category: string;
  images: string[];
}

export class ReportsService {
  async getReports(): Promise<Report[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*');

      if (error) {
        console.error('Error fetching reports:', error);
        throw new Error('Failed to fetch reports');
      }

      return data || [];
    } catch (error: any) {
      console.error('Unexpected error fetching reports:', error);
      throw new Error(error.message || 'Failed to fetch reports');
    }
  }

  async createReport(reportData: CreateReportRequest): Promise<Report> {
    try {
      // Validate coordinates using the database function
      const { data: areValidCoordinates, error: validationError } = await supabase.rpc('validate_coordinates', { 
        lat: reportData.latitude, 
        lng: reportData.longitude 
      });
      
      if (validationError) {
        console.error('Coordinate validation error:', validationError);
      }
      
      if (!areValidCoordinates) {
        throw new Error('Invalid coordinates provided');
      }

      const { data, error } = await supabase
        .from('reports')
        .insert([
          {
            latitude: reportData.latitude,
            longitude: reportData.longitude,
            description: reportData.description,
            category: reportData.category,
            images: reportData.images,
          },
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating report:', error);
        throw new Error('Failed to create report');
      }

      return data;
    } catch (error: any) {
      console.error('Unexpected error creating report:', error);
      throw new Error(error.message || 'Failed to create report');
    }
  }
}
