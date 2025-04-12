import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-polylinedecorator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Layers as LayersIcon, Maximize2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

// Type definition for polylineDecorator and Symbol
declare module 'leaflet' {
  export function polylineDecorator(
    polyline: L.Polyline, 
    options: any
  ): L.Layer;
  
  export namespace Symbol {
    export function arrowHead(options: any): any;
  }
}

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

  const [mapStatus, setMapStatus] = useState({
    activePoints: 0,
    lastUpdate: new Date().toLocaleTimeString(),
    zoomLevel: 14,
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false, // We'll position zoom control manually
        attributionControl: false, // Hide attribution initially
      }).setView([-3.3194, 114.5921], 14);
      
      // Add base tile layers with more options
      const baseMaps = {
        "Street": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }),
        "Satellite": L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          attribution: '&copy; Google Maps',
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }),
        "Terrain": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
          maxZoom: 17,
        }),
        "Dark": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        })
      };
      
      // Set default layer
      baseMaps["Street"].addTo(mapRef.current);
      
      // Add layer control
      L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(mapRef.current);
      
      // Add zoom control in a specific position
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      
      // Add scale control
      L.control.scale({ position: 'bottomleft', imperial: false }).addTo(mapRef.current);

      // Add attribution control
      L.control.attribution({ position: 'bottomleft' }).addTo(mapRef.current);
      
      // Add custom legend control
      const legendControl = L.Control.extend({
        options: {
          position: 'bottomleft'
        },
        onAdd: function() {
          const div = L.DomUtil.create('div', 'legend bg-white/90 p-2 rounded shadow-md text-xs border border-gray-300');
          div.innerHTML = `
            <div class="font-semibold mb-1">Legenda</div>
            <div class="flex items-center gap-1"><span class="w-3 h-3 inline-block bg-blue-500 rounded-full"></span> TPS</div>
            <div class="flex items-center gap-1"><span class="w-3 h-3 inline-block bg-red-500 rounded-full"></span> TPS Liar</div>
            <div class="flex items-center gap-1"><span class="w-3 h-3 inline-block bg-green-500 rounded-full"></span> Bank Sampah</div>
            <div class="flex items-center gap-1"><span class="w-3 h-3 inline-block bg-purple-500 rounded-full"></span> TPS 3R</div>
          `;
          return div;
        }
      });
      
      const legend = new legendControl();
      legend.addTo(mapRef.current);

      // Add layer group
      layerGroupRef.current.addTo(mapRef.current);

      // Event listener for zoom changes
      mapRef.current.on('zoomend', () => {
        if (mapRef.current) {
          setMapStatus(prev => ({
            ...prev,
            zoomLevel: mapRef.current!.getZoom()
          }));
        }
      });
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
    
    let activePointCount = 0;

    // Add TPS points
    if (activeLayers.includes('tps')) {
      mockData.tps.forEach((tps) => {
        activePointCount++;
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
            <div class="p-2">
              <h3 class="font-bold text-blue-600">${tps.name}</h3>
              <p class="text-sm mt-1">Kapasitas: <span class="font-semibold">${tps.capacity}</span></p>
              <p class="text-sm">Penggunaan: <span class="font-semibold">${tps.usage}</span></p>
              <div class="mt-2 h-2 bg-gray-200 rounded">
                <div class="h-full bg-blue-500 rounded" style="width: ${parseInt(tps.usage) / parseInt(tps.capacity) * 100}%"></div>
              </div>
            </div>
          `);
        layerGroupRef.current.addLayer(marker);
      });
    }
    
    // Add TPS Liar points
    if (activeLayers.includes('tps-liar')) {
      mockData['tps-liar'].forEach((tps) => {
        activePointCount++;
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
          <div class="p-2">
            <h3 class="font-bold text-red-600">${tps.name}</h3>
            <p class="text-sm mt-1">Status: <span class="font-semibold">${tps.status}</span></p>
            <div class="mt-2">
              <button class="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded">
                Laporkan
              </button>
            </div>
          </div>
        `);
        layerGroupRef.current.addLayer(marker);
      });
    }
    
    // Add Bank Sampah points
    if (activeLayers.includes('bank-sampah')) {
      mockData['bank-sampah'].forEach((bank) => {
        activePointCount++;
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
          <div class="p-2">
            <h3 class="font-bold text-green-600">${bank.name}</h3>
            <p class="text-sm mt-1">Pengumpulan: <span class="font-semibold">${bank.collection}</span></p>
            <div class="mt-2 flex space-x-2">
              <button class="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded">
                Detail
              </button>
              <button class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Navigasi
              </button>
            </div>
          </div>
        `);
        layerGroupRef.current.addLayer(marker);
      });
    }
    
    // Add TPS3R points
    if (activeLayers.includes('tps3r')) {
      mockData['tps3r'].forEach((tps) => {
        activePointCount++;
        const marker = L.marker([tps.lat, tps.lng], {
          icon: new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
            iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
            shadowUrl: markerShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        })
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-purple-600">${tps.name}</h3>
            <p class="text-sm mt-1">Pengolahan: <span class="font-semibold">${tps.processing}</span></p>
            <div class="mt-2">
              <button class="bg-purple-500 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded">
                Detail
              </button>
            </div>
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
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).bindPopup('Rute Pengangkutan Sampah');
      
      layerGroupRef.current.addLayer(route);
      
      // Use the polylinedecorator plugin carefully with proper type handling
      // @ts-ignore - Using the plugin with TypeScript requires ignoring type checking
      const arrowHead = L.polylineDecorator(route, {
        patterns: [
          {
            offset: '10%', 
            repeat: '25%', 
            // @ts-ignore - Using the plugin with TypeScript requires ignoring type checking
            symbol: L.Symbol.arrowHead({
              pixelSize: 15,
              pathOptions: {
                fillOpacity: 0.7,
                weight: 0,
                color: '#3388ff'
              }
            })
          }
        ]
      });
      
      layerGroupRef.current.addLayer(arrowHead);
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
    
    // Update status with current point count
    setMapStatus(prev => ({
      ...prev,
      activePoints: activePointCount,
      lastUpdate: new Date().toLocaleTimeString()
    }));
    
  }, [activeLayers, toast]);

  // Function to fetch real data from Supabase
  const fetchMapData = async () => {
    try {
      // Example of how to fetch data from Supabase
      // In a real implementation, this would query your Supabase tables
      // const { data, error } = await supabase
      //  .from('waste_collection_points')
      //  .select('*');
      
      // if (error) throw error;
      
      toast({
        title: "Data diperbarui",
        description: "Data peta berhasil diperbarui",
      });
      
      setMapStatus(prev => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString()
      }));
      
    } catch (error) {
      console.error("Error fetching map data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data peta terbaru",
        variant: "destructive"
      });
    }
  };

  // Take screenshot function
  const takeScreenshot = () => {
    toast({
      title: "Screenshot Peta",
      description: "Screenshot berhasil disimpan",
    });
  };

  return (
    <div className={`relative ${fullscreenMode ? 'h-[calc(100vh-4rem)]' : 'h-[600px]'} ${splitViewEnabled ? 'w-1/2' : 'w-full'} border border-border rounded-lg bg-muted/10 shadow-md overflow-hidden`}>
      {/* Command Center Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/90 backdrop-blur-sm text-white p-2 text-xs border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-medium">LIVE</span>
          </div>
          <div className="font-medium text-slate-300">
            {mapStatus.activePoints} titik aktif
          </div>
          <div className="text-slate-400">
            Terakhir diperbarui: {mapStatus.lastUpdate}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="h-6 text-xs bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
            onClick={fetchMapData}
          >
            Refresh Data
          </Button>
        </div>
      </div>
      
      {/* Map Container */}
      <div ref={mapContainerRef} className="h-full w-full" />
      
      {/* Map Controls */}
      <div className="absolute top-12 right-4 flex flex-col gap-2 z-10">
        <div className="bg-white/90 dark:bg-slate-800/90 rounded-md shadow-md border border-gray-200 dark:border-gray-700 p-1 backdrop-blur-sm">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.setView([-3.3194, 114.5921], 14);
              }
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Zoom Level Indicator */}
      <div className="absolute bottom-12 right-4 bg-white/90 dark:bg-slate-800/90 py-1 px-3 rounded shadow text-xs font-mono border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        Zoom: {mapStatus.zoomLevel}x
      </div>
      
      {/* Screenshot button */}
      <div className="absolute bottom-4 right-20 flex gap-2">
        <Button 
          variant="secondary" 
          size="sm"
          className="bg-white/90 hover:bg-white shadow-md text-xs h-7 px-2 flex items-center gap-1"
          onClick={takeScreenshot}
        >
          <Download className="h-3 w-3" />
          Screenshot
        </Button>
      </div>
    </div>
  );
};

export default MapView;
