import { useEffect, useCallback } from 'react';
import L from 'leaflet';
import { mockData } from './data/mock-map-data';
import { createColoredIcon } from './utils/leaflet-config';
import { LayerType } from './data/mock-map-data';
import { useToast } from '@/hooks/use-toast';

interface MapLayersProps {
  map: L.Map | null;
  layerGroup: L.LayerGroup;
  activeLayers: LayerType[];
  onPointsChange: (count: number) => void;
}

const MapLayers: React.FC<MapLayersProps> = ({ 
  map, 
  layerGroup, 
  activeLayers, 
  onPointsChange 
}) => {
  const { toast } = useToast();

  const handlePointsChange = useCallback((count: number) => {
    onPointsChange(count);
  }, [onPointsChange]);

  useEffect(() => {
    if (!map) return;
    
    // Clear all existing layers
    layerGroup.clearLayers();
    
    let activePointCount = 0;

    // Add TPS points
    if (activeLayers.includes('tps')) {
      mockData.tps.forEach((tps) => {
        activePointCount++;
        const marker = L.marker([tps.lat, tps.lng], {
          icon: createColoredIcon('blue')
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
        layerGroup.addLayer(marker);
      });
    }
    
    // Add TPS Liar points
    if (activeLayers.includes('tps-liar')) {
      mockData['tps-liar'].forEach((tps) => {
        activePointCount++;
        const marker = L.marker([tps.lat, tps.lng], {
          icon: createColoredIcon('red')
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
        layerGroup.addLayer(marker);
      });
    }
    
    // Add Bank Sampah points
    if (activeLayers.includes('bank-sampah')) {
      mockData['bank-sampah'].forEach((bank) => {
        activePointCount++;
        const marker = L.marker([bank.lat, bank.lng], {
          icon: createColoredIcon('green')
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
        layerGroup.addLayer(marker);
      });
    }
    
    // Add TPS3R points
    if (activeLayers.includes('tps3r')) {
      mockData['tps3r'].forEach((tps) => {
        activePointCount++;
        const marker = L.marker([tps.lat, tps.lng], {
          icon: createColoredIcon('violet')
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
        layerGroup.addLayer(marker);
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
      
      layerGroup.addLayer(route);
      
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
      
      layerGroup.addLayer(arrowHead);
    }
    
    // Add administrative boundaries
    if (activeLayers.includes('kecamatan')) {
      toast({
        title: "Informasi",
        description: "Data batas kecamatan dimuat.",
      });
    }
    
    if (activeLayers.includes('kelurahan')) {
      toast({
        title: "Informasi",
        description: "Data batas kelurahan dimuat.",
      });
    }
    
    // Update counts
    handlePointsChange(activePointCount);
    
  }, [activeLayers, map, layerGroup, handlePointsChange, toast]);

  return null;
};

export default MapLayers;
