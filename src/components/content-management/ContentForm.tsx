
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

interface ContentFormProps {
  onSubmit: (event: React.FormEvent) => void;
  isLoading: boolean;
  defaultValues?: {
    title?: string;
    category?: string;
    type?: string;
    content?: string;
  };
  isEdit?: boolean;
  onCancel: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({
  onSubmit,
  isLoading,
  defaultValues,
  isEdit = false,
  onCancel
}) => {
  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Konten" : "Tambah Konten Edukasi"}</DialogTitle>
        <DialogDescription>
          {isEdit ? "Perbarui konten edukasi yang sudah ada." : "Isi formulir berikut untuk menambahkan konten edukasi baru."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Judul</Label>
            <Input 
              name="title" 
              placeholder="Judul konten" 
              defaultValue={defaultValues?.title}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Select name="category" defaultValue={defaultValues?.category} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Artikel">Artikel</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Infografik">Infografik</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipe</Label>
              <Select name="type" defaultValue={defaultValues?.type} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Edukasi">Edukasi</SelectItem>
                  <SelectItem value="Kampanye">Kampanye</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Konten</Label>
            <Textarea
              name="content"
              placeholder="Tulis konten edukasi di sini..."
              className="min-h-[150px]"
              defaultValue={defaultValues?.content}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="thumbnail">Gambar/Thumbnail</Label>
            <div className="flex items-center gap-4">
              <Input type="file" className="max-w-xs" />
              <Button type="button" variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan sebagai Draft"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ContentForm;
