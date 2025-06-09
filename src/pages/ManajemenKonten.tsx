
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
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

// Mock data for demonstration
const mockContentData: EducationalContent[] = [
  {
    id: "1",
    title: "Cara Memilah Sampah yang Benar",
    content: "Pemilahan sampah adalah langkah awal yang penting dalam pengelolaan sampah yang baik...",
    category: "Artikel",
    type: "Edukasi",
    status: "published",
    author_id: "admin-1",
    author_name: "Admin System",
    views: 1250,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Video Tutorial Komposting",
    content: "Video panduan lengkap cara membuat kompos dari sampah organik rumah tangga...",
    category: "Video",
    type: "Tutorial",
    status: "published",
    author_id: "admin-1",
    author_name: "Admin System",
    views: 890,
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
  },
  {
    id: "3",
    title: "Infografik Dampak Sampah Plastik",
    content: "Infografik yang menunjukkan dampak negatif sampah plastik terhadap lingkungan...",
    category: "Infografik",
    type: "Kampanye",
    status: "draft",
    author_id: "admin-1",
    author_name: "Admin System",
    views: 0,
    created_at: "2024-01-20T09:15:00Z",
    updated_at: "2024-01-20T09:15:00Z",
  },
];

const ManajemenKonten = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const [content, setContent] = useState<EducationalContent[]>(mockContentData);
  const { toast } = useToast();
  const { user } = useAuth();

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
    
    const newContent: EducationalContent = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      type: formData.get("type") as string,
      content: formData.get("content") as string,
      status: "draft",
      author_id: user?.id || "unknown",
      author_name: user?.user_metadata?.full_name || "Admin",
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setContent(prev => [newContent, ...prev]);
    setIsAddDialogOpen(false);
    toast({
      title: "Konten berhasil ditambahkan",
      description: "Konten edukasi baru telah ditambahkan sebagai draft.",
    });
  };

  const handleEditContent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedContent) return;
    
    const formData = new FormData(event.target as HTMLFormElement);
    
    const updatedContent = {
      ...selectedContent,
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      type: formData.get("type") as string,
      content: formData.get("content") as string,
      updated_at: new Date().toISOString(),
    };

    setContent(prev => prev.map(item => 
      item.id === selectedContent.id ? updatedContent : item
    ));
    setIsEditDialogOpen(false);
    setSelectedContent(null);
    toast({
      title: "Konten berhasil diperbarui",
      description: "Perubahan konten telah disimpan.",
    });
  };

  const handleDelete = (id: string) => {
    setContent(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Konten berhasil dihapus",
      description: "Konten edukasi telah dihapus dari sistem.",
    });
  };

  const handlePublish = (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, status: "published", updated_at: new Date().toISOString() } : item
    ));
    toast({
      title: "Konten berhasil dipublikasi",
      description: "Konten sekarang dapat dilihat oleh publik.",
    });
  };

  const handleView = (item: EducationalContent) => {
    setSelectedContent(item);
    setIsViewDialogOpen(true);
    // Increment views
    setContent(prev => prev.map(contentItem => 
      contentItem.id === item.id ? { ...contentItem, views: contentItem.views + 1 } : contentItem
    ));
  };

  const handleEdit = (item: EducationalContent) => {
    setSelectedContent(item);
    setIsEditDialogOpen(true);
  };

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
              isLoading={false}
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
              isUpdating={false}
              isDeleting={false}
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
            isLoading={false}
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
