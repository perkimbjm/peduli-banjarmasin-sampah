
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Image, Table } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ExportTools = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (type: 'pdf' | 'excel' | 'image') => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Ekspor Berhasil",
      description: `Data telah diekspor ke format ${type.toUpperCase()}`,
    });
    
    setIsExporting(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Ekspor Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
        >
          <FileText className="h-4 w-4 mr-2" />
          Laporan PDF
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('excel')}
          disabled={isExporting}
        >
          <Table className="h-4 w-4 mr-2" />
          Data Excel
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('image')}
          disabled={isExporting}
        >
          <Image className="h-4 w-4 mr-2" />
          Gambar Peta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportTools;
