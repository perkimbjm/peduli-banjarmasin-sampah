import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ContentForm from "@/components/content-management/ContentForm";
import ContentFilters from "@/components/content-management/ContentFilters";
import ContentTable from "@/components/content-management/ContentTable";
import ContentViewDialog from "@/components/content-management/ContentViewDialog";

interface EducationalContent {
  id: string;
  title: string;
  content: string;
  category: string;
  type: string;
  status: string;
  author_id: string;
  author_name?: string;
  thumbnail_url?: string;
  views: number;
  created_at: string;
  updated_at: string;
}

const ManajemenKonten = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch educational content from Supabase
  const { data: content = [], isLoading } = useQuery({
    queryKey: ['educational-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('educational_content')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching content:', error);
        throw error;
      }
      
      return data as EducationalContent[];
    },
  });

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async (newContent: Omit<EducationalContent, 'id' | 'created_at' | 'updated_at' | 'views' | 'author_id'>) => {
      const { data, error } = await supabase
        .from('educational_content')
        .insert([{
          ...newContent,
          author_id: user?.id,
          author_name: user?.email || 'Admin',
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educational-content'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Konten berhasil ditambahkan",
        description: "Konten edukasi baru telah ditambahkan sebagai draft.",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal menambahkan konten",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<EducationalContent> }) => {
      const { data, error } = await supabase
        .from('educational_content')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educational-content'] });
      setIsEditDialogOpen(false);
      setSelectedContent(null);
      toast({
        title: "Konten berhasil diperbarui",
        description: "Perubahan konten telah disimpan.",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal memperbarui konten",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('educational_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educational-content'] });
      toast({
        title: "Konten berhasil dihapus",
        description: "Konten edukasi telah dihapus dari sistem.",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal menghapus konten",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Increment views mutation
  const incrementViewsMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const { error } = await supabase.rpc('increment_content_views', {
        content_id: contentId
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educational-content'] });
    },
  });

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddContent = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    
    createContentMutation.mutate({
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      type: formData.get("type") as string,
      content: formData.get("content") as string,
      status: 'draft',
      author_name: user?.email || 'Admin',
      thumbnail_url: null,
    });
  };

  const handleEditContent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedContent) return;
    
    const formData = new FormData(event.target as HTMLFormElement);
    
    updateContentMutation.mutate({
      id: selectedContent.id,
      updates: {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        type: formData.get("type") as string,
        content: formData.get("content") as string,
      }
    });
  };

  const handleDelete = (id: string) => {
    deleteContentMutation.mutate(id);
  };

  const handlePublish = (id: string) => {
    updateContentMutation.mutate({
      id,
      updates: { status: "published" }
    });
  };

  const handleView = (item: EducationalContent) => {
    setSelectedContent(item);
    setIsViewDialogOpen(true);
    incrementViewsMutation.mutate(item.id);
  };

  const handleEdit = (item: EducationalContent) => {
    setSelectedContent(item);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Memuat konten...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manajemen Konten Edukasi
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Kelola konten edukasi dan kampanye kesadaran masyarakat
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Konten
              </Button>
            </DialogTrigger>
            <ContentForm
              onSubmit={handleAddContent}
              isLoading={createContentMutation.isPending}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Daftar Konten Edukasi</CardTitle>
            <CardDescription>
              Kelola dan publikasikan konten edukasi untuk masyarakat
            </CardDescription>

            <ContentFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />
          </CardHeader>
          <CardContent>
            <ContentTable
              content={filteredContent}
              onView={handleView}
              onEdit={handleEdit}
              onPublish={handlePublish}
              onDelete={handleDelete}
              isUpdating={updateContentMutation.isPending}
              isDeleting={deleteContentMutation.isPending}
            />
          </CardContent>
        </Card>

        <ContentViewDialog
          isOpen={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          selectedContent={selectedContent}
        />

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <ContentForm
            onSubmit={handleEditContent}
            isLoading={updateContentMutation.isPending}
            defaultValues={selectedContent ? {
              title: selectedContent.title,
              category: selectedContent.category,
              type: selectedContent.type,
              content: selectedContent.content,
            } : undefined}
            isEdit={true}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedContent(null);
            }}
          />
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ManajemenKonten;
