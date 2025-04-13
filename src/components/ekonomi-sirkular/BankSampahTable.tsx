
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BankSampahItem {
  id: number;
  name: string;
  contact: string;
  lastTransaction: string;
  wasteProcessed: number;
  changePercentage: number | null;
}

interface BankSampahTableProps {
  data: BankSampahItem[];
}

export function BankSampahTable({ data }: BankSampahTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableCaption>Daftar Bank Sampah di Banjarmasin</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12 text-center">No.</TableHead>
            <TableHead>Bank Sampah</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead>Transaksi terakhir</TableHead>
            <TableHead className="text-right">-</TableHead>
            <TableHead className="text-right">Sampah Terkelola (Ton)</TableHead>
            <TableHead className="text-right">% Δ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-center">{item.id}.</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Button variant="link" className="p-0 h-auto text-primary">
                  {item.contact}
                </Button>
              </TableCell>
              <TableCell>{formatDate(item.lastTransaction)}</TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right font-medium">
                {item.wasteProcessed}
              </TableCell>
              <TableCell className={`text-right ${
                item.changePercentage === null 
                  ? "" 
                  : item.changePercentage > 0 
                    ? "text-green-500" 
                    : "text-red-500"
              }`}>
                {item.changePercentage !== null ? (
                  <div className="flex items-center justify-end">
                    {item.changePercentage > 0 ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(item.changePercentage).toFixed(1)}%
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Helper function to format dates
function formatDate(dateString: string): string {
  if (!dateString) return "-";
  
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}
