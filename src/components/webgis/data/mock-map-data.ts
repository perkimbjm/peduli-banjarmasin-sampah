
export type LayerType = 'tps' | 'tps-liar' | 'bank-sampah' | 'tps3r' | 'rute' | 'kecamatan' | 'kelurahan';

// Define mock data for our map layers
export const mockData = {
  tps: [
    { name: 'TPS Pasar Lama', lat: -3.3193, lng: 114.5921, capacity: '500 kg', usage: '350 kg' },
    { name: 'TPS Jalan Ahmad Yani', lat: -3.3280, lng: 114.5891, capacity: '650 kg', usage: '480 kg' },
    { name: 'TPS Teluk Dalam', lat: -3.3350, lng: 114.5950, capacity: '450 kg', usage: '390 kg' },
  ],
  'tps-liar': [
    { name: 'TPS Liar Pinggir Sungai', lat: -3.3245, lng: 114.6010, status: 'Perlu Dibersihkan' },
    { name: 'TPS Liar Pasar Malam', lat: -3.3198, lng: 114.5950, status: 'Sudah Dibersihkan' },
  ],
  'bank-sampah': [
    { name: 'Bank Sampah Sejahtera', lat: -3.3170, lng: 114.5980, collection: '120 kg/minggu' },
    { name: 'Bank Sampah Mandiri', lat: -3.3290, lng: 114.5840, collection: '90 kg/minggu' },
  ],
  'tps3r': [
    { name: 'TPS 3R Banjarmasin Utara', lat: -3.3130, lng: 114.5901, processing: '250 kg/hari' },
    { name: 'TPS 3R Banjarmasin Selatan', lat: -3.3320, lng: 114.5930, processing: '180 kg/hari' },
  ],
};
