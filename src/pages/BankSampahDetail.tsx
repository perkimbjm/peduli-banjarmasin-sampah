import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DetailHeader } from "@/components/bank-sampah/DetailHeader";
import { ContactInfo } from "@/components/bank-sampah/ContactInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Users, Calendar, Award, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LayerType } from "@/components/webgis/data/mock-map-data";

interface BankSampah {
  id: string;
  name: string;
  address: string;
  kelurahan: string;
  kecamatan: string;
  phoneNumber: string;
  email: string;
  instagram?: string;
  operationalHours: string;
  description: string;
  manager: string;
  establishedDate: string;
  memberCount: number;
  coordinates: [number, number];
  wasteTypes: string[];
  wasteCollected: number;
  logo: string;
  images: string[];
  partners: string[];
  achievements: Array<{
    year: string;
    title: string;
  }>;
  activities: Array<{
    date: string;
    title: string;
    description: string;
    image?: string;
  }>;
}

const bankSampahData: { [key: string]: BankSampah } = {
  "bs-001": {
    id: "bs-001",
    name: "Bank Sampah Mekar Sari",
    address: "Jl. Raya Banjar No. 123",
    kelurahan: "Sungai Jingah",
    kecamatan: "Banjarmasin Utara",
    phoneNumber: "0812-3456-7890",
    email: "mekarsari@gmail.com",
    instagram: "@banksampah.mekarsari",
    operationalHours: "Senin - Sabtu, 08:00 - 16:00",
    description: "Bank Sampah Mekar Sari adalah unit pengelolaan sampah yang didirikan oleh komunitas warga Kelurahan Sungai Jingah untuk mengurangi sampah di TPA dan menciptakan lingkungan yang bersih dan sehat. Kami menerima berbagai jenis sampah untuk didaur ulang dan memberikan manfaat ekonomi bagi anggota dan masyarakat sekitar.",
    manager: "Hj. Siti Fatimah",
    establishedDate: "2018-05-12",
    memberCount: 85,
    coordinates: [-3.2893, 114.5932],
    wasteTypes: ["Plastik", "Kertas", "Logam", "Kardus", "Botol Kaca"],
    wasteCollected: 12540,
    logo: "/lovable-uploads/1245d5e8-34dc-4410-a413-56fdb5ac7030.png",
    images: [
      "/assets/bank-sampah.webp",
      "/assets/to-tps.webp",
      "/assets/komposter.webp",
    ],
    partners: ["PT Indah Kiat", "Dinas Lingkungan Hidup", "PKK Kelurahan Sungai Jingah"],
    achievements: [
      { year: "2020", title: "Penghargaan Bank Sampah Terbaik Tingkat Kota" },
      { year: "2022", title: "Juara 2 Inovasi Pengelolaan Sampah Tingkat Provinsi" },
    ],
    activities: [
      {
        date: "2025-03-15",
        title: "Sosialisasi Pemilahan Sampah",
        description: "Kegiatan sosialisasi pemilahan sampah di SDN Sungai Jingah 3 untuk mengenalkan pentingnya pemilahan sampah sejak dini.",
        image: "/assets/komposter.webp"
      },
      {
        date: "2025-02-20",
        title: "Pelatihan Daur Ulang",
        description: "Workshop pembuatan kerajinan dari sampah plastik bersama ibu-ibu PKK Kelurahan Sungai Jingah.",
        image: "/assets/to-tps.webp"
      }
    ]
  },
  "bs-002": {
    id: "bs-002",
    name: "Bank Sampah Bersih Banjarmasin",
    address: "Jl. Belitung Darat No. 45",
    kelurahan: "Belitung Selatan",
    kecamatan: "Banjarmasin Barat",
    phoneNumber: "0812-8765-4321",
    email: "bersihbanjarmasin@gmail.com",
    instagram: "@banksampah.bersih",
    operationalHours: "Senin - Jumat, 09:00 - 15:00",
    description: "Bank Sampah Bersih Banjarmasin bertujuan untuk mengurangi jumlah sampah yang masuk ke TPA dan menciptakan lingkungan yang bersih. Kami menerima berbagai jenis sampah untuk didaur ulang dan memberikan nilai ekonomi bagi masyarakat.",
    manager: "H. Ahmad Ridwan",
    establishedDate: "2017-08-23",
    memberCount: 63,
    coordinates: [-3.3105, 114.5810],
    wasteTypes: ["Plastik", "Elektronik", "Kertas", "Kaca"],
    wasteCollected: 9870,
    logo: "/lovable-uploads/1245d5e8-34dc-4410-a413-56fdb5ac7030.png",
    images: [
      "/assets/bank-sampah.webp",
      "/assets/to-tps.webp",
    ],
    partners: ["Bank BRI", "Dinas Kebersihan", "RT. 05"],
    achievements: [
      { year: "2021", title: "Bank Sampah Terinovatif Tingkat Kecamatan" }
    ],
    activities: [
      {
        date: "2025-04-05",
        title: "Kerja Bakti",
        description: "Kerja bakti bersama warga di sepanjang sungai Martapura untuk membersihkan sampah.",
        image: "/assets/to-tps.webp"
      }
    ]
  }
};

const BankSampahDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [bankSampah, setBankSampah] = useState<BankSampah | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const activeLayers = useMemo<LayerType[]>(() => ['bank-sampah'], []);

  useEffect(() => {
    if (id && bankSampahData?.[id]) {
      setBankSampah(bankSampahData[id]);
    }
  }, [id]);

  useEffect(() => {
    if (!bankSampah) return;

    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(bankSampah.coordinates, 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    markerRef.current = L.marker(bankSampah.coordinates, { icon: customIcon })
      .addTo(mapRef.current)
      .bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-green-600">${bankSampah.name}</h3>
          <p class="text-sm mt-1">${bankSampah.address}</p>
          <div class="mt-2">
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${bankSampah.coordinates[0]},${bankSampah.coordinates[1]}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded flex justify-center items-center gap-1"
            >
              <Navigation className="h-3 w-3 !text-white !text-center" />
              Navigasi
            </a>
          </div>
        </div>
      `);

    mapRef.current.setView(bankSampah.coordinates, 15);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [bankSampah]);

  if (!bankSampah) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-semibold">Bank Sampah tidak ditemukan</h2>
        <Link to="/" className="text-green-600 hover:underline flex items-center justify-center mt-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke daftar Bank Sampah
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Link to="/" className="text-green-800 font-bold hover:underline flex items-center">
        <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Beranda
      </Link>
      
      <DetailHeader
        name={bankSampah.name}
        logo={bankSampah.logo}
        address={bankSampah.address}
        kelurahan={bankSampah.kelurahan}
        kecamatan={bankSampah.kecamatan}
        wasteTypes={bankSampah.wasteTypes}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
              <TabsTrigger value="info">Informasi</TabsTrigger>
              <TabsTrigger value="activities">Aktivitas</TabsTrigger>
              <TabsTrigger value="achievements">Prestasi</TabsTrigger>
              <TabsTrigger value="gallery">Galeri</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-6 mt-6">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4">Tentang {bankSampah.name}</h2>
                <p>{bankSampah.description}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Data Pengelolaan Sampah</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Scale className="h-5 w-5 mr-3 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Sampah Terkumpul</p>
                          <p className="font-semibold">{formatNumber(bankSampah.wasteCollected)} kg</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-3 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Anggota Terdaftar</p>
                          <p className="font-semibold">{bankSampah.memberCount} orang</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Tanggal Pendirian</p>
                          <p className="font-semibold">{formatDate(bankSampah.establishedDate)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Mitra Kerja</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {bankSampah.partners.map((partner, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          <span>{partner}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="activities" className="space-y-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Kegiatan Terbaru</h2>
              <div className="space-y-6">
                {bankSampah.activities.map((activity, index) => (
                  <Card key={index}>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        {activity.image && (
                          <div className="h-48 md:h-full">
                            <img 
                              src={activity.image} 
                              alt={activity.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className={`p-6 ${activity.image ? 'md:col-span-2' : 'md:col-span-3'}`}>
                          <p className="text-sm text-muted-foreground">{formatDate(activity.date)}</p>
                          <h3 className="font-semibold text-xl mt-1 mb-2">{activity.title}</h3>
                          <p>{activity.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="achievements" className="space-y-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Prestasi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bankSampah.achievements.map((achievement, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="bg-green-50 text-green-600 p-3 rounded-full">
                        <Award className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="font-semibold text-xl">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">Tahun {achievement.year}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="gallery" className="space-y-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Galeri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bankSampah.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${bankSampah.name} - Image ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <ContactInfo
            manager={bankSampah.manager}
            phoneNumber={bankSampah.phoneNumber}
            email={bankSampah.email}
            instagram={bankSampah.instagram}
            operationalHours={bankSampah.operationalHours}
            wasteTypes={bankSampah.wasteTypes}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Lokasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div id="map" className="h-[300px] w-full rounded-b-lg"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BankSampahDetail;
