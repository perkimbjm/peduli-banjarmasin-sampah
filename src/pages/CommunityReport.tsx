
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for reports
const reportsData = [
  {
    id: 1,
    title: "Tumpukan sampah di Jl. Sudirman",
    location: "Jl. Sudirman No. 123",
    status: "pending",
    createdAt: "2025-04-08T09:30:00Z",
    description: "Ada tumpukan sampah yang belum diangkut selama 3 hari.",
    reporter: "warga@example.com",
  },
  {
    id: 2,
    title: "Saluran air tersumbat sampah",
    location: "Jl. Gatot Subroto No. 45",
    status: "in_progress",
    createdAt: "2025-04-07T14:15:00Z",
    description: "Saluran air tersumbat oleh sampah plastik dan menyebabkan genangan.",
    reporter: "komunitas@example.com",
  },
  {
    id: 3,
    title: "Pembuangan sampah ilegal",
    location: "Taman Kota Blok C",
    status: "resolved",
    createdAt: "2025-04-05T10:45:00Z",
    description: "Ada aktivitas pembuangan sampah ilegal di area taman kota.",
    reporter: "petugas@example.com",
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

const statusLabels = {
  pending: "Menunggu",
  in_progress: "Diproses",
  resolved: "Selesai",
};

const CommunityReport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("all");
  const [open, setOpen] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(null);

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setOpen(true);
  };

  const filteredReports = activeTab === "all" ? reportsData : reportsData.filter(report => report.status === activeTab);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pelaporan Masyarakat</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Lihat dan kelola laporan terkait sampah dari masyarakat
          </p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="pending">Menunggu</TabsTrigger>
              <TabsTrigger value="in_progress">Diproses</TabsTrigger>
              <TabsTrigger value="resolved">Selesai</TabsTrigger>
            </TabsList>
            <Button>Buat Laporan Baru</Button>
          </div>
          
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} onViewDetail={handleViewDetail} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} onViewDetail={handleViewDetail} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="in_progress" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} onViewDetail={handleViewDetail} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="resolved" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} onViewDetail={handleViewDetail} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
            <DialogDescription>
              Detail laporan dari masyarakat
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{selectedReport.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{formatDate(selectedReport.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedReport.status]}`}>
                  {statusLabels[selectedReport.status]}
                </span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Deskripsi:</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedReport.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Pelapor:</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedReport.reporter}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Tutup
            </Button>
            {selectedReport?.status !== 'resolved' && (
              <Button>
                {selectedReport?.status === 'pending' ? 'Proses Laporan' : 'Selesaikan Laporan'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

const ReportCard = ({ report, onViewDetail }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{report.title}</CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
            {statusLabels[report.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4" />
          <span>{report.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>{new Date(report.createdAt).toLocaleDateString('id-ID')}</span>
        </div>
        <Button variant="outline" className="w-full mt-2" onClick={() => onViewDetail(report)}>
          Lihat Detail
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunityReport;
