
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, FileIcon, MessagesSquare, Users, Lightbulb, MapPin, GitMerge, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

// Mock data for the forum
const forumThreads = [
  {
    id: 1,
    title: "Program pengurangan sampah plastik di sekolah",
    author: "Dinas Lingkungan Hidup",
    authorType: "government",
    date: "2025-04-09T08:30:00Z",
    replies: 12,
    category: "Program",
    excerpt: "Kami berencana untuk memulai program pengurangan sampah plastik di sekolah. Kami ingin mendapatkan masukan dari komunitas...",
  },
  {
    id: 2,
    title: "Inisiatif pembersihan sungai Barito",
    author: "Komunitas Peduli Lingkungan",
    authorType: "community",
    date: "2025-04-08T14:45:00Z",
    replies: 8,
    category: "Event",
    excerpt: "Kami mengajak seluruh relawan untuk berpartisipasi dalam kegiatan pembersihan sungai Barito pada hari Sabtu mendatang...",
  },
  {
    id: 3,
    title: "Donasi tempat sampah untuk taman kota",
    author: "PT Green Solutions",
    authorType: "company",
    date: "2025-04-07T10:15:00Z",
    replies: 5,
    category: "Donasi",
    excerpt: "Perusahaan kami berniat menyumbangkan 50 tempat sampah terpisah untuk taman kota. Kami ingin berdiskusi dengan pemerintah kota...",
  },
];

// Mock data for shared documents
const documents = [
  { id: 1, title: "Laporan Pengelolaan Sampah 2025", type: "pdf", size: "2.3 MB", author: "Dinas Lingkungan Hidup", date: "2025-04-05" },
  { id: 2, title: "SOP Pemilahan Sampah", type: "docx", size: "1.5 MB", author: "Tim Pengelolaan Sampah", date: "2025-03-28" },
  { id: 3, title: "Data Statistik Volume Sampah Q1 2025", type: "xlsx", size: "4.2 MB", author: "Divisi Analitik", date: "2025-04-01" },
  { id: 4, title: "Peta Lokasi Bank Sampah", type: "jpg", size: "3.7 MB", author: "Tim GIS", date: "2025-03-15" },
];

// Mock data for ideas
const ideas = [
  { 
    id: 1, 
    title: "Aplikasi Mobile untuk Pelaporan Sampah", 
    author: "Ahmad Dahlan",
    votes: 24,
    date: "2025-04-03",
    description: "Mengembangkan aplikasi mobile untuk memudahkan masyarakat melaporkan tumpukan sampah liar melalui smartphone mereka."
  },
  { 
    id: 2, 
    title: "Sistem Reward untuk Pemilahan Sampah", 
    author: "Siti Aminah",
    votes: 18,
    date: "2025-03-29",
    description: "Membuat sistem poin reward untuk warga yang konsisten memilah sampah dan menyetorkannya ke bank sampah."
  },
  { 
    id: 3, 
    title: "Program Edukasi Kompos Rumahan", 
    author: "Budi Santoso",
    votes: 15,
    date: "2025-04-01",
    description: "Mengadakan pelatihan pembuatan kompos skala rumah tangga untuk mengurangi volume sampah organik."
  },
];

// Mock data for field coordination
const fieldReports = [
  {
    id: 1,
    location: "Tepi Sungai Barito, Banjarmasin Selatan",
    coordinates: "-3.314494, 114.591231",
    reporter: "Tim Sungai Bersih",
    status: "critical",
    timestamp: "2025-04-10T09:45:00Z",
    description: "Tumpukan sampah plastik yang sangat banyak di tepi sungai, berpotensi terbawa arus saat musim hujan."
  },
  {
    id: 2,
    location: "Pasar Lama, Banjarmasin Tengah",
    coordinates: "-3.324561, 114.589754",
    reporter: "Relawan Area Pasar",
    status: "moderate",
    timestamp: "2025-04-09T15:30:00Z",
    description: "Sampah pasar belum diangkut selama 2 hari, mulai menumpuk di beberapa titik."
  },
  {
    id: 3,
    location: "Taman Kota, Banjarmasin Utara",
    coordinates: "-3.302456, 114.593210",
    reporter: "Pengawas Taman",
    status: "minor",
    timestamp: "2025-04-10T07:15:00Z",
    description: "Beberapa tempat sampah penuh dan perlu segera dikosongkan sebelum jam ramai pengunjung."
  },
];

// Mock data for projects
const projects = [
  {
    id: 1,
    title: "Revitalisasi Bank Sampah Sejahtera",
    status: "in-progress",
    progress: 65,
    members: 8,
    deadline: "2025-05-15",
    description: "Meningkatkan kapasitas dan infrastruktur Bank Sampah Sejahtera untuk melayani lebih banyak masyarakat."
  },
  {
    id: 2,
    title: "Kampanye #BanjarmasinBebaSampah",
    status: "planning",
    progress: 30,
    members: 12,
    deadline: "2025-06-01",
    description: "Kampanye media sosial dan edukasi untuk meningkatkan kesadaran masyarakat tentang pengelolaan sampah."
  },
  {
    id: 3,
    title: "Pengadaan Alat Pengolah Sampah Organik",
    status: "completed",
    progress: 100,
    members: 5,
    deadline: "2025-03-30",
    description: "Pengadaan dan instalasi 10 unit alat pengolah sampah organik di beberapa kelurahan."
  },
];

// Mock data for virtual meetings
const meetings = [
  {
    id: 1,
    title: "Rapat Koordinasi Pengelolaan Sampah Bulanan",
    date: "2025-04-15T14:00:00Z",
    organizer: "Dinas Lingkungan Hidup",
    platform: "Zoom",
    participants: 25,
    link: "https://zoom.us/j/1234567890",
  },
  {
    id: 2,
    title: "Diskusi Rencana Aksi #BanjarmasinBebaSampah",
    date: "2025-04-18T09:30:00Z",
    organizer: "Tim Kampanye",
    platform: "Google Meet",
    participants: 18,
    link: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 3,
    title: "Pelatihan Pengelolaan Bank Sampah",
    date: "2025-04-22T13:00:00Z",
    organizer: "Koordinator Bank Sampah",
    platform: "Microsoft Teams",
    participants: 30,
    link: "https://teams.microsoft.com/l/meetup-join/...",
  },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const Kolaborasi = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("forum");

  // Get user's display information
  const userEmail = user?.email || 'user@example.com';
  const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase();

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portal Kolaborasi Terpadu</h1>
          <p className="text-muted-foreground mt-2">
            Platform kolaborasi untuk pemerintah, relawan, komunitas, dan swasta dalam pengelolaan sampah.
          </p>
        </div>

        <Tabs defaultValue="forum" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
            <TabsTrigger value="forum" className="flex items-center gap-2"><MessagesSquare className="h-4 w-4" /> Forum</TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2"><FileIcon className="h-4 w-4" /> Dokumen</TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Ide</TabsTrigger>
            <TabsTrigger value="coordination" className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Koordinasi</TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2"><GitMerge className="h-4 w-4" /> Proyek</TabsTrigger>
            <TabsTrigger value="meetings" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Pertemuan</TabsTrigger>
          </TabsList>

          {/* Forum Tab */}
          <TabsContent value="forum" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <Input placeholder="Cari diskusi..." className="w-full md:w-80" />
                <Button>Cari</Button>
              </div>
              <Button className="bg-peduli-600 hover:bg-peduli-700">Buat Diskusi Baru</Button>
            </div>

            <div className="grid gap-4">
              {forumThreads.map((thread) => (
                <Card key={thread.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{thread.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{thread.author}</span>
                          <span>•</span>
                          <span>{formatDate(thread.date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{thread.category}</Badge>
                        <Badge variant="secondary">{thread.replies} balasan</Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{thread.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <Input placeholder="Cari dokumen..." className="w-full md:w-80" />
                <Button>Cari</Button>
              </div>
              <Button className="bg-peduli-600 hover:bg-peduli-700">Unggah Dokumen</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Nama Dokumen</th>
                    <th className="text-left py-3">Tipe</th>
                    <th className="text-left py-3">Ukuran</th>
                    <th className="text-left py-3">Diunggah Oleh</th>
                    <th className="text-left py-3">Tanggal</th>
                    <th className="text-left py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                        {doc.title}
                      </td>
                      <td className="py-3">{doc.type.toUpperCase()}</td>
                      <td className="py-3">{doc.size}</td>
                      <td className="py-3">{doc.author}</td>
                      <td className="py-3">{doc.date}</td>
                      <td className="py-3">
                        <Button variant="outline" size="sm">Unduh</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <Input placeholder="Cari ide..." className="w-full md:w-80" />
                <Button>Cari</Button>
              </div>
              <Button className="bg-peduli-600 hover:bg-peduli-700">Bagikan Ide Baru</Button>
            </div>

            <div className="grid gap-4">
              {ideas.map((idea) => (
                <Card key={idea.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{idea.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>Oleh: {idea.author}</span>
                          <span>•</span>
                          <span>{idea.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" /> 
                          Dukung ({idea.votes})
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{idea.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coordination Tab */}
          <TabsContent value="coordination" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <Input placeholder="Cari laporan lapangan..." className="w-full md:w-80" />
                <Button>Cari</Button>
              </div>
              <Button className="bg-peduli-600 hover:bg-peduli-700">Tambah Laporan</Button>
            </div>

            <div className="grid gap-4">
              {fieldReports.map((report) => (
                <Card key={report.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{report.location}</h3>
                          <Badge 
                            variant={report.status === "critical" ? "destructive" : 
                              report.status === "moderate" ? "default" : "outline"}
                          >
                            {report.status === "critical" ? "Kritis" : 
                              report.status === "moderate" ? "Sedang" : "Ringan"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{report.coordinates}</span>
                          <span>•</span>
                          <span>Oleh: {report.reporter}</span>
                          <span>•</span>
                          <span>{formatDate(report.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">Lihat Detail</Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{report.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <Input placeholder="Cari proyek..." className="w-full md:w-80" />
                <Button>Cari</Button>
              </div>
              <Button className="bg-peduli-600 hover:bg-peduli-700">Proyek Baru</Button>
            </div>

            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          <Badge 
                            variant={project.status === "completed" ? "outline" : 
                              project.status === "in-progress" ? "default" : "secondary"}
                          >
                            {project.status === "completed" ? "Selesai" : 
                              project.status === "in-progress" ? "Sedang Berjalan" : "Perencanaan"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Users className="h-3 w-3" />
                          <span>{project.members} anggota</span>
                          <span>•</span>
                          <span>Deadline: {project.deadline}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">Lihat Proyek</Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">Progress: {project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-peduli-600" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <Input placeholder="Cari pertemuan..." className="w-full md:w-80" />
                <Button>Cari</Button>
              </div>
              <Button className="bg-peduli-600 hover:bg-peduli-700">Jadwalkan Pertemuan</Button>
            </div>

            <div className="grid gap-4">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{meeting.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{formatDate(meeting.date)}</span>
                          <span>•</span>
                          <span>{meeting.platform}</span>
                          <span>•</span>
                          <span>{meeting.participants} peserta</span>
                        </div>
                        <div className="mt-1 text-sm">
                          <span>Penyelenggara: {meeting.organizer}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button className="bg-peduli-600 hover:bg-peduli-700" size="sm">Gabung</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Kolaborasi;
