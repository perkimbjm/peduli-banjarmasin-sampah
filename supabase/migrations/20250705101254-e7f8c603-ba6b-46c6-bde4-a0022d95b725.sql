
-- Enhance the existing educational_content table with additional fields
ALTER TABLE educational_content 
ADD COLUMN IF NOT EXISTS media_urls JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS engagement_stats JSONB DEFAULT '{}'::jsonb;

-- Create content_interactions table
CREATE TABLE IF NOT EXISTS content_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES educational_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'bookmark', 'share', 'view')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(content_id, user_id, interaction_type)
);

-- Create content_comments table
CREATE TABLE IF NOT EXISTS content_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES educational_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES content_comments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create educational_campaigns table
CREATE TABLE IF NOT EXISTS educational_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  target_audience TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_by UUID REFERENCES profiles(id) NOT NULL,
  participant_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create campaign_participants table
CREATE TABLE IF NOT EXISTS campaign_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES educational_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  participation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'participated', 'completed')),
  UNIQUE(campaign_id, user_id)
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_educational_content_status_created ON educational_content(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_interactions_content_user ON content_interactions(content_id, user_id, interaction_type);
CREATE INDEX IF NOT EXISTS idx_content_interactions_type_created ON content_interactions(interaction_type, created_at);
CREATE INDEX IF NOT EXISTS idx_content_comments_content ON content_comments(content_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_status_dates ON educational_campaigns(status, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_campaign_participants_campaign ON campaign_participants(campaign_id, status);

-- Enable RLS on new tables
ALTER TABLE content_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_interactions
CREATE POLICY "Everyone can view interactions" ON content_interactions FOR SELECT USING (true);
CREATE POLICY "Users can manage their own interactions" ON content_interactions FOR ALL USING (auth.uid() = user_id);

-- RLS policies for content_comments
CREATE POLICY "Everyone can view comments" ON content_comments FOR SELECT USING (true);
CREATE POLICY "Users can manage their own comments" ON content_comments FOR ALL USING (auth.uid() = user_id);

-- RLS policies for educational_campaigns
CREATE POLICY "Everyone can view campaigns" ON educational_campaigns FOR SELECT USING (true);
CREATE POLICY "Admins can manage all campaigns" ON educational_campaigns FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));
CREATE POLICY "Creators can manage their own campaigns" ON educational_campaigns FOR ALL USING (auth.uid() = created_by);

-- RLS policies for campaign_participants
CREATE POLICY "Everyone can view participants" ON campaign_participants FOR SELECT USING (true);
CREATE POLICY "Users can manage their own participation" ON campaign_participants FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all participants" ON campaign_participants FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Function to calculate engagement stats
CREATE OR REPLACE FUNCTION calculate_content_engagement(content_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'likes', COALESCE(likes.count, 0),
    'bookmarks', COALESCE(bookmarks.count, 0),
    'shares', COALESCE(shares.count, 0),
    'comments', COALESCE(comments.count, 0)
  ) INTO result
  FROM (
    SELECT 
      (SELECT COUNT(*) FROM content_interactions WHERE content_interactions.content_id = calculate_content_engagement.content_id AND interaction_type = 'like') as likes,
      (SELECT COUNT(*) FROM content_interactions WHERE content_interactions.content_id = calculate_content_engagement.content_id AND interaction_type = 'bookmark') as bookmarks,
      (SELECT COUNT(*) FROM content_interactions WHERE content_interactions.content_id = calculate_content_engagement.content_id AND interaction_type = 'share') as shares,
      (SELECT COUNT(*) FROM content_comments WHERE content_comments.content_id = calculate_content_engagement.content_id) as comments
  ) as stats(likes, bookmarks, shares, comments);
  
  RETURN result;
END;
$$;

-- Function to update campaign participant count
CREATE OR REPLACE FUNCTION update_campaign_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE educational_campaigns 
    SET participant_count = participant_count + 1 
    WHERE id = NEW.campaign_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE educational_campaigns 
    SET participant_count = participant_count - 1 
    WHERE id = OLD.campaign_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update participant count
CREATE TRIGGER update_campaign_participants_count
  AFTER INSERT OR DELETE ON campaign_participants
  FOR EACH ROW EXECUTE FUNCTION update_campaign_participant_count();

-- Trigger to update updated_at on content_comments
CREATE TRIGGER update_content_comments_updated_at
  BEFORE UPDATE ON content_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on educational_campaigns  
CREATE TRIGGER update_educational_campaigns_updated_at
  BEFORE UPDATE ON educational_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
