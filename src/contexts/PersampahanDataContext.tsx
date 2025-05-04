import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Interface untuk fitur persampahan
interface PersampahanFeature {
  type: string;
  properties: {
    NAMOBJ: string;
    [key: string]: string | number;
  };
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}

// Interface untuk fitur bank sampah
interface BankSampahFeature {
  type: string;
  properties: {
    Nama: string;
    ID: number;
    KELURAHAN: string | null;
    KECAMATAN: string | null;
    [key: string]: string | number | null;
  };
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}

// Interface untuk fitur komposting
interface KompostingFeature {
  type: string;
  properties: {
    nama: string;
    id: number;
    alamat: string;
    KELURAHAN: string | null;
    KECAMATAN: string | null;
    [key: string]: string | number | null;
  };
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}

interface PersampahanData {
  type: string;
  features: PersampahanFeature[];
}

interface BankSampahData {
  type: string;
  features: BankSampahFeature[];
}

interface KompostingData {
  type: string;
  features: KompostingFeature[];
}

interface PersampahanStats {
  totalTPS: number;     // Jumlah TPS reguler saja
  totalTPS3R: number;   // Jumlah TPS3R saja
  totalAll: number;     // Total semua TPS (reguler + TPS3R)
  totalBankSampah: number; // Jumlah Bank Sampah
  kelurahanBankSampah: number; // Jumlah Kelurahan yang memiliki Bank Sampah
  totalKomposting: number; // Jumlah Rumah Kompos
}

interface PersampahanDataContextType {
  persampahanData: PersampahanData | null;
  bankSampahData: BankSampahData | null;
  kompostingData: KompostingData | null;
  persampahanFeatures: PersampahanFeature[];
  bankSampahFeatures: BankSampahFeature[];
  kompostingFeatures: KompostingFeature[];
  stats: PersampahanStats;
  loading: boolean;
  error: string | null;
}

const PersampahanDataContext = createContext<PersampahanDataContextType>({
  persampahanData: null,
  bankSampahData: null,
  kompostingData: null,
  persampahanFeatures: [],
  bankSampahFeatures: [],
  kompostingFeatures: [],
  stats: { 
    totalTPS: 0, 
    totalTPS3R: 0, 
    totalAll: 0,
    totalBankSampah: 0,
    kelurahanBankSampah: 0,
    totalKomposting: 0
  },
  loading: true,
  error: null,
});

export const usePersampahanData = () => useContext(PersampahanDataContext);

export const PersampahanDataProvider = ({ children }: { children: ReactNode }) => {
  const [persampahanData, setPersampahanData] = useState<PersampahanData | null>(null);
  const [bankSampahData, setBankSampahData] = useState<BankSampahData | null>(null);
  const [kompostingData, setKompostingData] = useState<KompostingData | null>(null);
  const [persampahanFeatures, setPersampahanFeatures] = useState<PersampahanFeature[]>([]);
  const [bankSampahFeatures, setBankSampahFeatures] = useState<BankSampahFeature[]>([]);
  const [kompostingFeatures, setKompostingFeatures] = useState<KompostingFeature[]>([]);
  const [stats, setStats] = useState<PersampahanStats>({ 
    totalTPS: 0, 
    totalTPS3R: 0, 
    totalAll: 0,
    totalBankSampah: 0,
    kelurahanBankSampah: 0,
    totalKomposting: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fungsi untuk mendapatkan data persampahan dan bank sampah
    const fetchData = async () => {
      try {
        // Fetch persampahan data
        const persampahanResponse = await fetch('/data-map/persampahan.geojson');
        if (!persampahanResponse.ok) throw new Error('Failed to fetch persampahan.geojson');
        const persampahanJsonData = await persampahanResponse.json();
        
        // Fetch bank sampah data
        const bankSampahResponse = await fetch('/data-map/bank_sampah.geojson');
        if (!bankSampahResponse.ok) throw new Error('Failed to fetch bank_sampah.geojson');
        const bankSampahJsonData = await bankSampahResponse.json();
        
        // Fetch komposting data
        const kompostingResponse = await fetch('/data-map/komposting.geojson');
        if (!kompostingResponse.ok) throw new Error('Failed to fetch komposting.geojson');
        const kompostingJsonData = await kompostingResponse.json();
        
        // Set data to state
        setPersampahanData(persampahanJsonData);
        setBankSampahData(bankSampahJsonData);
        setKompostingData(kompostingJsonData);
        setPersampahanFeatures(persampahanJsonData.features);
        setBankSampahFeatures(bankSampahJsonData.features);
        setKompostingFeatures(kompostingJsonData.features);
        
        // Hitung jumlah TPS dan TPS3R
        let tpsCount = 0;
        let tps3rCount = 0;
        
        persampahanJsonData.features.forEach((feature: PersampahanFeature) => {
          if (feature.properties && feature.properties.NAMOBJ) {
            if (feature.properties.NAMOBJ === "Tempat Penampungan Sementara (TPS)") {
              tpsCount++;
            } else if (feature.properties.NAMOBJ === "Tempat Pengelolaan Sampah Reuse, Reduce, Recycle (TPS3R)") {
              tps3rCount++;
            }
          }
        });
        
        // Hitung jumlah Bank Sampah dan berapa kelurahan yang dilayani
        const totalBankSampah = bankSampahJsonData.features.length;
        
        // Hitung jumlah kelurahan unik yang memiliki Bank Sampah
        const uniqueKelurahan = new Set<string>();
        bankSampahJsonData.features.forEach((feature: BankSampahFeature) => {
          if (feature.properties && feature.properties.KELURAHAN) {
            uniqueKelurahan.add(feature.properties.KELURAHAN);
          }
        });
        
        // Hitung jumlah fasilitas komposting
        const totalKomposting = kompostingJsonData.features.length;
        
        setStats({
          totalTPS: tpsCount,
          totalTPS3R: tps3rCount,
          totalAll: tpsCount + tps3rCount,
          totalBankSampah: totalBankSampah,
          kelurahanBankSampah: uniqueKelurahan.size,
          totalKomposting: totalKomposting
        });
        
        setLoading(false);
      } catch (e: any) {
        console.error('Error fetching data:', e);
        setError(e.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <PersampahanDataContext.Provider value={{ 
      persampahanData, 
      bankSampahData,
      kompostingData,
      persampahanFeatures, 
      bankSampahFeatures,
      kompostingFeatures,
      stats, 
      loading, 
      error 
    }}>
      {children}
    </PersampahanDataContext.Provider>
  );
}; 