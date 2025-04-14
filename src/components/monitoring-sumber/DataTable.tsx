
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WasteSource {
  id: string;
  name: string;
  type: string; 
  district: string;
  subdistrict: string;
  location: string;
  coordinates: [number, number];
}

interface DataTableProps {
  currentItems: WasteSource[];
  currentPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  filteredSources: WasteSource[];
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

const DataTable = ({
  currentItems,
  currentPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  filteredSources,
  goToNextPage,
  goToPrevPage
}: DataTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">No.</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kecamatan</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kelurahan</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Jenis</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Lokasi</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {currentItems.map((source, index) => (
                  <tr key={source.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">{indexOfFirstItem + index + 1}</td>
                    <td className="p-4 align-middle">Banjarmasin</td>
                    <td className="p-4 align-middle">{source.district}</td>
                    <td className="p-4 align-middle">{source.subdistrict}</td>
                    <td className="p-4 align-middle">{source.type}</td>
                    <td className="p-4 align-middle font-medium">{source.name}</td>
                    <td className="p-4 align-middle">{source.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 0 ? (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSources.length)} dari {filteredSources.length} data
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  <div className="text-sm font-medium">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
                Tidak ada data yang ditemukan
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
