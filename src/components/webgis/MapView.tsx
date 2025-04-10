
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Icon assets
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon path issues in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Define layer types for type safety
export type LayerType = 'tps' | 'tps-liar' | 'bank-sampah' | 'tps3r' | 'rute' | 'kecamatan' | 'kelurahan';

// Define mock data for our map layers
const mockData = {
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

interface MapViewProps {
  activeLayers: LayerType[];
  fullscreenMode: boolean;
  splitViewEnabled: boolean;
}

const MapView = ({ activeLayers, fullscreenMode, splitViewEnabled }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layerGroupRef = useRef<L.LayerGroup>(new L.LayerGroup());
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([-3.3194, 114.5921], 14);
      
      // Add base tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Add layer group
      layerGroupRef.current.addTo(mapRef.current);

      // Add map controls
      L.control.scale().addTo(mapRef.current);
    }

    // Adjust map when fullscreen or split view changes
    const map = mapRef.current;
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    // Cleanup function
    return () => {
      // We don't remove the map on cleanup to preserve the instance
    };
  }, [fullscreenMode, splitViewEnabled]);

  // Update layers based on active selection
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clear all existing layers
    layerGroupRef.current.clearLayers();
    
    // Add TPS points
    if (activeLayers.includes('tps')) {
      mockData.tps.forEach((tps) => {
        const marker = L.marker([tps.lat, tps.lng])
          .bindPopup(`
            <div>
              <h3 class="font-bold">${tps.name}</h3>
              <p>Kapasitas: ${tps.capacity}</p>
              <p>Penggunaan: ${tps.usage}</p>
            </div>
          `);
        layerGroupRef.current.addLayer(marker);
      });
    }
    
    // Add TPS Liar points
    if (activeLayers.includes('tps-liar')) {
      mockData['tps-liar'].forEach((tps) => {
        const marker = L.marker([tps.lat, tps.lng], {
          icon: new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: markerShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        })
        .bindPopup(`
          <div>
            <h3 class="font-bold">${tps.name}</h3>
            <p>Status: ${tps.status}</p>
          </div>
        `);
        layerGroupRef.current.addLayer(marker);
      });
    }
    
    // Add Bank Sampah points
    if (activeLayers.includes('bank-sampah')) {
      mockData['bank-sampah'].forEach((bank) => {
        const marker = L.marker([bank.lat, bank.lng], {
          icon: new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
            iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: markerShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        })
        .bindPopup(`
          <div>
            <h3 class="font-bold">${bank.name}</h3>
            <p>Pengumpulan: ${bank.collection}</p>
          </div>
        `);
        layerGroupRef.current.addLayer(marker);
      });
    }
    
    // Add TPS3R points
    if (activeLayers.includes('tps3r')) {
      mockData['tps3r'].forEach((tps) => {
        const marker = L.marker([tps.lat, tps.lng], {
          icon: new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
            iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: markerShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        })
        .bindPopup(`
          <div>
            <h3 class="font-bold">${tps.name}</h3>
            <p>Pengolahan: ${tps.processing}</p>
          </div>
        `);
        layerGroupRef.current.addLayer(marker);
      });
    }
    
    // Add route if active
    if (activeLayers.includes('rute')) {
      // Mock route data
      const routePoints = [
        [-3.3193, 114.5921],
        [-3.3240, 114.5930],
        [-3.3280, 114.5891],
        [-3.3320, 114.5930],
        [-3.3350, 114.5950]
      ];
      
      const route = L.polyline(routePoints as L.LatLngExpression[], {
        color: '#3388ff',
        weight: 4,
        opacity: 0.7
      }).bindPopup('Rute Pengangkutan Sampah');
      
      layerGroupRef.current.addLayer(route);
    }
    
    // Add administrative boundaries
    if (activeLayers.includes('kecamatan')) {
      // This would normally load actual GeoJSON data
      toast({
        title: "Informasi",
        description: "Data batas kecamatan dimuat.",
      });
      // In a real app, we'd add a GeoJSON layer here
    }
    
    if (activeLayers.includes('kelurahan')) {
      toast({
        title: "Informasi",
        description: "Data batas kelurahan dimuat.",
      });
      // In a real app, we'd add a GeoJSON layer here
    }
    
  }, [activeLayers, toast]);

  // Take screenshot function (mock for now)
  const takeScreenshot = () => {
    toast({
      title: "Screenshot Peta",
      description: "Screenshot berhasil disimpan",
    });
  };

  return (
    <div className={`relative ${fullscreenMode ? 'h-[calc(100vh-4rem)]' : 'h-[600px]'} ${splitViewEnabled ? 'w-1/2' : 'w-full'}`}>
      <div ref={mapContainerRef} className="h-full w-full rounded-lg border border-border" />
      
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button 
          variant="secondary" 
          size="sm"
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={takeScreenshot}
        >
          Screenshot
        </Button>
      </div>
    </div>
  );
};

export default MapView;
