
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, Film, MoreVertical, Eye, Edit, Upload, Trash2 } from "lucide-react";

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

interface ContentTableProps {
  content: EducationalContent[];
  onView: (item: EducationalContent) => void;
  onEdit: (item: EducationalContent) => void;
  onPublish: (id: string) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const ContentTable: React.FC<ContentTableProps> = ({
  content,
  onView,
  onEdit,
  onPublish,
  onDelete,
  isUpdating,
  isDeleting
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Judul</TableHead>
            <TableHead className="w-[15%]">Kategori</TableHead>
            <TableHead className="w-[15%]">Tipe</TableHead>
            <TableHead className="w-[12%]">Status</TableHead>
            <TableHead className="w-[10%]">Views</TableHead>
            <TableHead className="w-[8%] text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.length > 0 ? (
            content.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.title}
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(item.created_at).toLocaleDateString('id-ID')} - {item.author_name || 'Admin'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.category === "Artikel" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Film className="h-4 w-4" />
                    )}
                    {item.category}
                  </div>
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "published" ? "default" : "outline"}>
                    {item.status === "published" ? "Dipublikasi" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>{item.views.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => onView(item)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {item.status === "draft" && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onPublish(item.id)}
                          disabled={isUpdating}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Publikasikan
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => onDelete(item.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Tidak ada data yang ditemukan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContentTable;
