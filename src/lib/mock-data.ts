// Mock waste sources data for map visualization in the MonitoringSumberSampah page
export const mapWasteSourcesData = {
  wasteSourcesLocation: [
    {
      id: 1,
      name: "TPS Pasar Lama",
      type: "TPS",
      lat: -3.3193,
      lng: 114.5921,
      capacity: "500 kg",
      usage: "350 kg"
    },
    {
      id: 2,
      name: "TPS Jalan Ahmad Yani", 
      type: "TPS",
      lat: -3.3280, 
      lng: 114.5891, 
      capacity: "650 kg", 
      usage: "480 kg"
    },
    {
      id: 3,
      name: "TPS Teluk Dalam", 
      type: "TPS",
      lat: -3.3350, 
      lng: 114.5950, 
      capacity: "450 kg", 
      usage: "390 kg"
    },
    {
      id: 4,
      name: "Bank Sampah Sejahtera", 
      type: "Bank Sampah",
      lat: -3.3170, 
      lng: 114.5980, 
      collection: "120 kg/minggu"
    },
    {
      id: 5,
      name: "Bank Sampah Mandiri", 
      type: "Bank Sampah",
      lat: -3.3290, 
      lng: 114.5840, 
      collection: "90 kg/minggu"
    },
    {
      id: 6,
      name: "TPS 3R Banjarmasin Utara", 
      type: "TPS3R",
      lat: -3.3130, 
      lng: 114.5901, 
      processing: "250 kg/hari"
    },
    {
      id: 7,
      name: "TPS 3R Banjarmasin Selatan", 
      type: "TPS3R",
      lat: -3.3320, 
      lng: 114.5930, 
      processing: "180 kg/hari"
    },
    {
      id: 8,
      name: "TPS Liar Pinggir Sungai", 
      type: "TPS Liar",
      lat: -3.3245, 
      lng: 114.6010, 
      status: "Perlu Dibersihkan"
    },
    {
      id: 9,
      name: "TPS Liar Pasar Malam", 
      type: "TPS Liar",
      lat: -3.3198, 
      lng: 114.5950, 
      status: "Sudah Dibersihkan"
    }
  ]
};

// Add mock data for circular economy monitoring
export const circularEconomyData = {
  // Facility counts
  facilityCounts: {
    tpa: 1,
    tps3r: 5,
    tpsTerpadu: 7,
    pusatDaurUlang: 3,
    bankSampah: 28
  },
  
  // Summary statistics
  statistics: {
    sampahTerkelola: {
      value: 51,
      unit: "Ton",
      change: -92.66,
      period: "YtD"
    },
    ekonomiSirkular: {
      value: 0.14,
      unit: "Milyar",
      prefix: "Rp",
      change: -78.74,
      period: "YtD"
    },
    partisipasiMasyarakat: {
      value: 1260,
      label: "Sebagai Nasabah Bank Sampah",
      change: -45.15,
      period: "YtD"
    },
    bankSampahDigital: {
      value: 266,
      total: 3162,
      percentage: 8,
      source: "Digitalisasi menggunakan Smash.id"
    }
  },
  
  // Waste composition data
  wasteComposition: [
    { name: "Plastik", value: 30.1, color: "#619DE9" },
    { name: "Kertas", value: 27.7, color: "#FFD25D" },
    { name: "Logam", value: 13.2, color: "#8E8F90" },
    { name: "Kaca & Beling", value: 12.9, color: "#95BCBA" },
    { name: "Jelantah", value: 6.5, color: "#82C59C" },
    { name: "Residu", value: 4.1, color: "#E37D75" },
    { name: "Sampah Elektronik", value: 2.1, color: "#FF8A3D" },
    { name: "Karet & Kulit", value: 1.7, color: "#B875B0" },
    { name: "Tekstil", value: 1.2, color: "#5C54C7" },
    { name: "Organik", value: 0.5, color: "#4CAF50" }
  ],
  
  // Bank sampah data
  bankSampahData: [
    {
      id: 1,
      name: "Bank Sampah Basirih Indah",
      contact: "Hubungi via WA",
      lastTransaction: "2025-01-30",
      wasteProcessed: 24,
      changePercentage: -65.4
    },
    {
      id: 2,
      name: "Bank Sampah Sungai Jingah",
      contact: "Hubungi via WA",
      lastTransaction: "2025-04-10",
      wasteProcessed: 4,
      changePercentage: null
    },
    {
      id: 3,
      name: "Bank Sampah Kelayan",
      contact: "Hubungi via WA",
      lastTransaction: "2025-04-06",
      wasteProcessed: 4,
      changePercentage: -17.2
    },
    {
      id: 4,
      name: "Bank Sampah Teluk Dalam",
      contact: "Hubungi via WA",
      lastTransaction: "2025-04-11",
      wasteProcessed: 3,
      changePercentage: 75.8
    },
    {
      id: 5,
      name: "Bank Sampah Sabilal",
      contact: "Hubungi via WA",
      lastTransaction: "2025-04-11",
      wasteProcessed: 3,
      changePercentage: -17.6
    },
    {
      id: 6,
      name: "Bank Sampah Kayutangi",
      contact: "Hubungi via WA",
      lastTransaction: "2025-03-16",
      wasteProcessed: 2,
      changePercentage: null
    },
    {
      id: 7,
      name: "Bank Sampah Banua Anyar",
      contact: "Hubungi via WA",
      lastTransaction: "2025-02-23",
      wasteProcessed: 1,
      changePercentage: null
    },
    {
      id: 8,
      name: "Bank Sampah Pemurus",
      contact: "Hubungi via WA",
      lastTransaction: "2025-03-12",
      wasteProcessed: 1,
      changePercentage: null
    },
    {
      id: 9,
      name: "Bank Sampah Alalak",
      contact: "Hubungi via WA",
      lastTransaction: "2025-03-06",
      wasteProcessed: 1,
      changePercentage: null
    },
    {
      id: 10,
      name: "Bank Sampah Cempaka",
      contact: "Hubungi via WA",
      lastTransaction: "2025-02-16",
      wasteProcessed: 1,
      changePercentage: 36.1
    }
  ],

  // Districts (kecamatan) in Banjarmasin
  districts: [
    "Semua Kecamatan",
    "Banjarmasin Barat", 
    "Banjarmasin Selatan", 
    "Banjarmasin Tengah", 
    "Banjarmasin Timur",
    "Banjarmasin Utara"
  ]
};
