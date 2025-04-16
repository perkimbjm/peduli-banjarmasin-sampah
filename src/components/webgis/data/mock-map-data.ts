export type LayerType = 'tps' | 'tps-liar' | 'bank-sampah' | 'tps3r' | 'rute' | 'kecamatan' | 'kelurahan';

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  [key: string]: any;
}

// Mock data for different map layers
export const mockData = {
  'tps': [
    { id: 'tps1', lat: -3.319, lng: 114.5921, name: 'TPS Teluk Dalam', capacity: '10 ton', usage: '6 ton' },
    { id: 'tps2', lat: -3.324, lng: 114.587, name: 'TPS Jalan Sultan Adam', capacity: '5 ton', usage: '4 ton' },
    { id: 'tps3', lat: -3.313, lng: 114.595, name: 'TPS Pasar Lama', capacity: '8 ton', usage: '7 ton' },
    { id: 'tps4', lat: -3.331, lng: 114.601, name: 'TPS Pelambuan', capacity: '12 ton', usage: '5 ton' }
  ],
  'tps-liar': [
    { id: 'tpsliar1', lat: -3.316, lng: 114.582, name: 'TPS Liar Jalan Belitung', status: 'Dilaporkan' },
    { id: 'tpsliar2', lat: -3.327, lng: 114.588, name: 'TPS Liar Simpang Ulin', status: 'Belum diproses' },
    { id: 'tpsliar3', lat: -3.322, lng: 114.610, name: 'TPS Liar Veteran', status: 'Dalam penanganan' }
  ],
  'bank-sampah': [
    {
      id: 'bs-001',
      name: 'Bank Sampah Mekar Sari',
      lat: -3.2893,
      lng: 114.5932,
      collection: '12.5 ton',
    },
    {
      id: 'bs-002',
      name: 'Bank Sampah Bersih Banjarmasin',
      lat: -3.3105,
      lng: 114.5810,
      collection: '9.87 ton',
    },
    {
      id: 'bs-003',
      name: 'Bank Sampah Sejahtera',
      lat: -3.3089,
      lng: 114.6032,
      collection: '7.2 ton',
    },
    {
      id: 'bs-004',
      name: 'Bank Sampah Maju Jaya',
      lat: -3.3187,
      lng: 114.5991,
      collection: '5.8 ton',
    },
    {
      id: 'bs-005',
      name: 'Bank Sampah Cahaya Bersih',
      lat: -3.3045,
      lng: 114.5917,
      collection: '4.2 ton',
    },
  ],
  'tps3r': [
    { id: 'tps3r1', lat: -3.325, lng: 114.597, name: 'TPS3R Banua Anyar', processing: '3 ton/hari' },
    { id: 'tps3r2', lat: -3.315, lng: 114.604, name: 'TPS3R Sungai Jingah', processing: '2 ton/hari' }
  ]
};
