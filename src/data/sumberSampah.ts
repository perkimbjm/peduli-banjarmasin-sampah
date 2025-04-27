export interface SumberSampahData {
  tahun: number;
  "Rumah Tangga": number;
  Perkantoran: number;
  Pasar: number;
  Perniagaan: number;
  "Fasilitas Publik": number;
  Kawasan: number;
  Lain: number;
  Total: number;
}

const sumberSampahData: SumberSampahData[] = [
  {
    tahun: 2020,
    "Rumah Tangga": 10250,
    Perkantoran: 1850,
    Pasar: 3200,
    Perniagaan: 2100,
    "Fasilitas Publik": 900,
    Kawasan: 1200,
    Lain: 500,
    Total: 10250 + 1850 + 3200 + 2100 + 900 + 1200 + 500,
  },
  {
    tahun: 2021,
    "Rumah Tangga": 11000,
    Perkantoran: 1950,
    Pasar: 3400,
    Perniagaan: 2200,
    "Fasilitas Publik": 950,
    Kawasan: 1250,
    Lain: 550,
    Total: 11000 + 1950 + 3400 + 2200 + 950 + 1250 + 550,
  },
  {
    tahun: 2022,
    "Rumah Tangga": 11500,
    Perkantoran: 2000,
    Pasar: 3500,
    Perniagaan: 2300,
    "Fasilitas Publik": 1000,
    Kawasan: 1300,
    Lain: 600,
    Total: 11500 + 2000 + 3500 + 2300 + 1000 + 1300 + 600,
  },
  {
    tahun: 2023,
    "Rumah Tangga": 12000,
    Perkantoran: 2100,
    Pasar: 3700,
    Perniagaan: 2400,
    "Fasilitas Publik": 1050,
    Kawasan: 1350,
    Lain: 650,
    Total: 12000 + 2100 + 3700 + 2400 + 1050 + 1350 + 650,
  },
];

export function getSumberSampahData(): SumberSampahData[] {
  return sumberSampahData;
}
