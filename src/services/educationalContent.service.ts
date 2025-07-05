
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Extended interface for content with engagement data
export interface ContentWithEngagement extends Tables<'educational_content'> {
  author_name: string;
  author_avatar?: string;
  likes_count: number;
  bookmarks_count: number;
  shares_count: number;
  comments_count: number;
  is_liked_by_user: boolean;
  is_bookmarked_by_user: boolean;
  is_shared_by_user: boolean;
}

// Statistics interfaces
export interface ContentStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalViews: number;
  totalLikes: number;
  totalBookmarks: number;
  totalShares: number;
  totalComments: number;
}

export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalParticipants: number;
  avgParticipationRate: number;
}

// Query parameters interface
interface ContentQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'latest' | 'popular' | 'most_liked';
}

// Service class for educational content
class EducationalContentService {
  async getEducationalContent(params: ContentQueryParams = {}) {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = 'latest'
    } = params;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('educational_content')
      .select(`
        *,
        profiles!educational_content_author_id_fkey(full_name, avatar_url)
      `)
      .eq('status', 'published');

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        query = query.order('views', { ascending: false });
        break;
      case 'most_liked':
        query = query.order('engagement_stats->likes', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    // Get current user ID for interaction checks
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Transform data to include engagement info
    const transformedData: ContentWithEngagement[] = await Promise.all(
      (data || []).map(async (item) => {
        // Get engagement stats
        const { data: engagementData } = await supabase.rpc('calculate_content_engagement', {
          content_id: item.id
        });

        // Check user interactions if logged in
        let userInteractions = {
          is_liked_by_user: false,
          is_bookmarked_by_user: false,
          is_shared_by_user: false
        };

        if (userId) {
          const { data: interactions } = await supabase
            .from('content_interactions')
            .select('interaction_type')
            .eq('content_id', item.id)
            .eq('user_id', userId);

          userInteractions = {
            is_liked_by_user: interactions?.some(i => i.interaction_type === 'like') || false,
            is_bookmarked_by_user: interactions?.some(i => i.interaction_type === 'bookmark') || false,
            is_shared_by_user: interactions?.some(i => i.interaction_type === 'share') || false
          };
        }

        const profiles = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
        const engagement = engagementData as any || { likes: 0, bookmarks: 0, shares: 0, comments: 0 };

        return {
          ...item,
          author_name: profiles?.full_name || 'Anonymous',
          author_avatar: profiles?.avatar_url,
          likes_count: engagement.likes || 0,
          bookmarks_count: engagement.bookmarks || 0,
          shares_count: engagement.shares || 0,
          comments_count: engagement.comments || 0,
          ...userInteractions,
        };
      })
    );

    return {
      data: transformedData,
      count,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    };
  }

  async toggleInteraction(contentId: string, type: 'like' | 'bookmark' | 'share') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Check if interaction exists
    const { data: existing } = await supabase
      .from('content_interactions')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', user.id)
      .eq('interaction_type', type)
      .single();

    if (existing) {
      // Remove interaction
      const { error } = await supabase
        .from('content_interactions')
        .delete()
        .eq('id', existing.id);
      
      if (error) throw error;
      return false; // Removed
    } else {
      // Add interaction
      const { error } = await supabase
        .from('content_interactions')
        .insert({
          content_id: contentId,
          user_id: user.id,
          interaction_type: type
        });
      
      if (error) throw error;
      return true; // Added
    }
  }

  async getContentStatistics(): Promise<ContentStats> {
    const { data: contentStats, error } = await supabase
      .from('educational_content')
      .select('status, views')
      .not('views', 'is', null);

    if (error) throw error;

    const { data: interactionStats, error: interactionError } = await supabase
      .from('content_interactions')
      .select('interaction_type');

    if (interactionError) throw interactionError;

    const { data: commentStats, error: commentError } = await supabase
      .from('content_comments')
      .select('id');

    if (commentError) throw commentError;

    const totalContent = contentStats?.length || 0;
    const publishedContent = contentStats?.filter(c => c.status === 'published').length || 0;
    const draftContent = contentStats?.filter(c => c.status === 'draft').length || 0;
    const totalViews = contentStats?.reduce((sum, c) => sum + (c.views || 0), 0) || 0;
    const totalLikes = interactionStats?.filter(i => i.interaction_type === 'like').length || 0;
    const totalBookmarks = interactionStats?.filter(i => i.interaction_type === 'bookmark').length || 0;
    const totalShares = interactionStats?.filter(i => i.interaction_type === 'share').length || 0;
    const totalComments = commentStats?.length || 0;

    return {
      totalContent,
      publishedContent,
      draftContent,
      totalViews,
      totalLikes,
      totalBookmarks,
      totalShares,
      totalComments,
    };
  }

  async getCampaignStatistics(): Promise<CampaignStats> {
    const { data: campaigns, error } = await supabase
      .from('educational_campaigns')
      .select('status, participant_count');

    if (error) throw error;

    const totalCampaigns = campaigns?.length || 0;
    const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
    const completedCampaigns = campaigns?.filter(c => c.status === 'completed').length || 0;
    const totalParticipants = campaigns?.reduce((sum, c) => sum + (c.participant_count || 0), 0) || 0;
    const avgParticipationRate = totalCampaigns > 0 ? totalParticipants / totalCampaigns : 0;

    return {
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      totalParticipants,
      avgParticipationRate,
    };
  }

  async getCampaigns() {
    const { data, error } = await supabase
      .from('educational_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

// Export singleton instance
export const educationalContentService = new EducationalContentService();
