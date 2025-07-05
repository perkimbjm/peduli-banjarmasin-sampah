// This file defines the correct TypeScript type for the educational_content table in Supabase.
// Please update this type according to your actual Supabase schema if needed.

export interface EducationalContentRow {
  id: string;
  title: string;
  content: string; // formerly 'caption' in frontend
  category: string;
  type: string;
  media: string[]; // array of image/video URLs
  timestamp: string; // ISO string
  status: string; // e.g. 'draft' | 'published'
  author?: string; // optional, if available
  // Add other fields from your Supabase table as needed
}
