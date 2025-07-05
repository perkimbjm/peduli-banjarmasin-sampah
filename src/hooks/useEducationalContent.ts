
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { educationalContentService, ContentWithEngagement, ContentStats } from '@/services/educationalContent.service';
import { useToast } from '@/hooks/use-toast';

export const useEducationalContent = (params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'latest' | 'popular' | 'most_liked';
} = {}) => {
  return useQuery({
    queryKey: ['educational-content', params],
    queryFn: () => educationalContentService.getEducationalContent(params),
  });
};

export const useContentInteraction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ contentId, type }: { contentId: string; type: 'like' | 'bookmark' | 'share' }) =>
      educationalContentService.toggleInteraction(contentId, type),
    onSuccess: (isAdded, { type }) => {
      queryClient.invalidateQueries({ queryKey: ['educational-content'] });
      toast({
        title: isAdded ? `${type} ditambahkan` : `${type} dihapus`,
        description: isAdded ? `Konten telah di-${type}` : `${type} telah dihapus dari konten`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal memperbarui interaksi",
        variant: "destructive",
      });
    },
  });
};

export const useContentStatistics = () => {
  return useQuery({
    queryKey: ['content-statistics'],
    queryFn: () => educationalContentService.getContentStatistics(),
  });
};

export const useCampaignStatistics = () => {
  return useQuery({
    queryKey: ['campaign-statistics'],
    queryFn: () => educationalContentService.getCampaignStatistics(),
  });
};

export const useEducationalCampaigns = () => {
  return useQuery({
    queryKey: ['educational-campaigns'],
    queryFn: () => educationalContentService.getCampaigns(),
  });
};
