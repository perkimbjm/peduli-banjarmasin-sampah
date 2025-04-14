
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PageHeaderProps {
  handleRefresh: () => void;
  handleExport: () => void;
  isRefreshing: boolean;
}

const PageHeader = ({ handleRefresh, handleExport, isRefreshing }: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Monitoring Sumber Sampah dan Fasilitas</h1>
        <p className="text-muted-foreground">
          Pantau dan analisis sebaran sumber sampah dan fasilitas pengelolaan sampah di Banjarmasin
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
        >
          <Download className="h-4 w-4 mr-2" />
          Ekspor
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
