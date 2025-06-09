
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

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

interface ContentViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContent: EducationalContent | null;
}

const ContentViewDialog: React.FC<ContentViewDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedContent
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selectedContent?.title}</DialogTitle>
          <DialogDescription>
            {selectedContent?.category} - {selectedContent?.type}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Badge
                variant={selectedContent?.status === "published" ? "default" : "outline"}
                className="ml-2"
              >
                {selectedContent?.status === "published" ? "Dipublikasi" : "Draft"}
              </Badge>
            </div>
            <div>
              <Label>Konten</Label>
              <div className="mt-2 p-4 bg-muted rounded-md">
                <p className="text-sm">{selectedContent?.content}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tanggal</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedContent?.created_at && new Date(selectedContent.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div>
                <Label>Views</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedContent?.views?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentViewDialog;
