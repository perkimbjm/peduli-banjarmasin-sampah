
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type EducationalContent = Database['public']['Tables']['educational_content']['Row'];
type EducationalContentInsert = Database['public']['Tables']['educational_content']['Insert'];
type EducationalContentUpdate = Database['public']['Tables']['educational_content']['Update'];
type ContentInteraction = Database['public']['Tables']['content_interactions']['Row'];
type EducationalCampaign = Database['public']['Tables']['educational_campaigns']['Row'];

export interface ContentWithEngagement extends EducationalContent {
  author_name?: string;
  author_avatar?: string;
  likes_count: number;
  bookmarks_count: number;
  shares_count: number;
  comments_count: number;
  is_liked_by_user: boolean;
  is_bookmarked_by_user: boolean;
}

export interface ContentStats {
  total_content: number;
  published_content: number;
  content_this_month: number;
  avg_views_per_content: number;
  total_interactions: number;
  top_categories: Array<{
    category: string;
    count: number;
  }>;
}

class EducationalContentService {
  // Get educational content with engagement data
  async getEducationalContent(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: 'latest' | 'popular' | 'most_liked';
    status?: 'published' | 'draft';
  } = {}): Promise<{ data: ContentWithEngagement[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = 'latest',
      status = 'published'
    } = params;

    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('educational_content')
      .select(`
        *,
        profiles!educational_content_author_id_fkey(full_name, avatar_url)
      `)
      .eq('status', status);

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Apply sorting
    switch (sortBy) {
      case 'latest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        query = query.order('views', { ascending: false });
        break;
      case 'most_liked':
        // This would need a more complex query with joins
        query = query.order('created_at', { ascending: false });
        break;
    }

    const { data: content, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Get engagement data for each content
    const enrichedContent = await Promise.all(
      (content || []).map(async (item) => {
        const engagementStats = await this.getContentEngagement(item.id);
        const userInteractions = await this.getUserInteractions(item.id);
        
        return {
          ...item,
          author_name: item.profiles?.full_name || 'Anonymous',
          author_avatar: item.profiles?.avatar_url || null,
          likes_count: engagementStats.likes,
          bookmarks_count: engagementStats.bookmarks,
          shares_count: engagementStats.shares,
          comments_count: engagementStats.comments,
          is_liked_by_user: userInteractions.includes('like'),
          is_bookmarked_by_user: userInteractions.includes('bookmark')
        } as ContentWithEngagement;
      })
    );

    return { data: enrichedContent, count: count || 0 };
  }

  // Get engagement statistics for content
  async getContentEngagement(contentId: string) {
    const { data, error } = await supabase
      .rpc('calculate_content_engagement', { content_id: contentId });

    if (error) throw error;
    
    return data || { likes: 0, bookmarks: 0, shares: 0, comments: 0 };
  }

  // Get user interactions for specific content
  async getUserInteractions(contentId: string): Promise<string[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    const { data, error } = await supabase
      .from('content_interactions')
      .select('interaction_type')
      .eq('content_id', contentId)
      .eq('user_id', user.user.id);

    if (error) throw error;
    
    return data?.map(item => item.interaction_type) || [];
  }

  // Toggle user interaction (like, bookmark, share)
  async toggleInteraction(contentId: string, type: 'like' | 'bookmark' | 'share') {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    // Check if interaction exists
    const { data: existing } = await supabase
      .from('content_interactions')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', user.user.id)
      .eq('interaction_type', type)
      .single();

    if (existing) {
      // Remove interaction
      const { error } = await supabase
        .from('content_interactions')
        .delete()
        .eq('id', existing.id);
      
      if (error) throw error;
      return false; // Interaction removed
    } else {
      // Add interaction
      const { error } = await supabase
        .from('content_interactions')
        .insert({
          content_id: contentId,
          user_id: user.user.id,
          interaction_type: type
        });
      
      if (error) throw error;
      return true; // Interaction added
    }
  }

  // Get content statistics for statistics page
  async getContentStatistics(): Promise<ContentStats> {
    // Get overall content stats
    const { data: contentStats, error: contentStatsError } = await supabase
      .from('educational_content')
      .select('id, status, created_at, views, category');

    if (contentStatsError) throw contentStatsError;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const total_content = contentStats?.length || 0;
    const published_content = contentStats?.filter(c => c.status === 'published').length || 0;
    const content_this_month = contentStats?.filter(c => 
      new Date(c.created_at) >= thisMonth
    ).length || 0;
    const avg_views_per_content = contentStats?.reduce((sum, c) => sum + (c.views || 0), 0) / total_content || 0;

    // Get interaction stats
    const { data: interactionStats, error: interactionError } = await supabase
      .from('content_interactions')
      .select('id');

    if (interactionError) throw interactionError;

    const total_interactions = interactionStats?.length || 0;

    // Get top categories
    const categoryCount = contentStats?.reduce((acc, content) => {
      const category = content.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const top_categories = Object.entries(categoryCount || {})
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total_content,
      published_content,
      content_this_month,
      avg_views_per_content: Math.round(avg_views_per_content),
      total_interactions,
      top_categories
    };
  }

  // Create new educational content
  async createContent(content: EducationalContentInsert): Promise<EducationalContent> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('educational_content')
      .insert({
        ...content,
        author_id: user.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update educational content
  async updateContent(id: string, updates: EducationalContentUpdate): Promise<EducationalContent> {
    const { data, error } = await supabase
      .from('educational_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete educational content
  async deleteContent(id: string): Promise<void> {
    const { error } = await supabase
      .from('educational_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Get educational campaigns
  async getCampaigns(): Promise<EducationalCampaign[]> {
    const { data, error } = await supabase
      .from('educational_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get campaign statistics
  async getCampaignStatistics() {
    const { data: campaigns, error } = await supabase
      .from('educational_campaigns')
      .select('id, status, participant_count');

    if (error) throw error;

    const total_campaigns = campaigns?.length || 0;
    const active_campaigns = campaigns?.filter(c => c.status === 'active').length || 0;
    const completed_campaigns = campaigns?.filter(c => c.status === 'completed').length || 0;
    const avg_participants = campaigns?.reduce((sum, c) => sum + (c.participant_count || 0), 0) / total_campaigns || 0;

    return {
      total_campaigns,
      active_campaigns,
      completed_campaigns,
      avg_participants_per_campaign: Math.round(avg_participants)
    };
  }
}

export const educationalContentService = new EducationalContentService();
