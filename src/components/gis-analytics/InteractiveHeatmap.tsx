
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InteractiveHeatmapProps {
  timeFrame: 'daily' | 'weekly' | 'monthly';
  activeLayers: string[];
}

const InteractiveHeatmap = ({ timeFrame, activeLayers }: InteractiveHeatmapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedZone, setSelectedZone] = useState<any>(null);

  // Mock heatmap data
  const heatmapData = {
    daily: [
      { lat: -3.3194, lng: 114.5921, intensity: 0.8, volume: '2.5 ton', frequency: '2x' },
      { lat: -3.3240, lng: 114.5930, intensity: 0.6, volume: '1.8 ton', frequency: '1x' },
      { lat: -3.3280, lng: 114.5891, intensity: 0.9, volume: '3.2 ton', frequency: '3x' },
    ],
    weekly: [
      { lat: -3.3194, lng: 114.5921, intensity: 0.7, volume: '15.2 ton', frequency: '12x' },
      { lat: -3.3240, lng: 114.5930, intensity: 0.5, volume: '10.8 ton', frequency: '8x' },
      { lat: -3.3280, lng: 114.5891, intensity: 0.8, volume: '18.6 ton', frequency: '15x' },
    ],
    monthly: [
      { lat: -3.3194, lng: 114.5921, intensity: 0.6, volume: '58.5 ton', frequency: '45x' },
      { lat: -3.3240, lng: 114.5930, intensity: 0.4, volume: '42.3 ton', frequency: '32x' },
      { lat: -3.3280, lng: 114.5891, intensity: 0.7, volume: '72.1 ton', frequency: '58x' },
    ],
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([-3.3194, 114.5921], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    // Clear existing layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add heatmap points
    const currentData = heatmapData[timeFrame];
    currentData.forEach((point) => {
      const circle = L.circleMarker([point.lat, point.lng], {
        radius: point.intensity * 20,
        fillColor: getIntensityColor(point.intensity),
        color: getIntensityColor(point.intensity),
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.5
      });

      circle.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">Data Pengumpulan Sampah</h3>
          <p><strong>Volume:</strong> ${point.volume}</p>
          <p><strong>Frekuensi:</strong> ${point.frequency}</p>
          <p><strong>Intensitas:</strong> ${(point.intensity * 100).toFixed(0)}%</p>
        </div>
      `);

      circle.on('click', () => {
        setSelectedZone(point);
      });

      if (mapRef.current) {
        circle.addTo(mapRef.current);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [timeFrame, activeLayers]);

  const getIntensityColor = (intensity: number) => {
    if (intensity > 0.7) return '#ef4444'; // High - Red
    if (intensity > 0.5) return '#f59e0b'; // Medium - Orange
    return '#10b981'; // Low - Green
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity > 0.7) return 'Tinggi';
    if (intensity > 0.5) return 'Sedang';
    return 'Rendah';
  };

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Peta Intensitas Pengumpulan Sampah</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={mapContainerRef} className="h-[500px] w-full rounded-lg" />
            
            {/* Legend */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm font-medium">Intensitas:</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-xs">Rendah</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-xs">Sedang</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-xs">Tinggi</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone Details Panel */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Detail Zona</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedZone ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Volume Terkumpul</span>
                  <p className="text-lg font-semibold">{selectedZone.volume}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Frekuensi Pengangkutan</span>
                  <p className="text-lg font-semibold">{selectedZone.frequency}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Status Intensitas</span>
                  <div className="mt-1">
                    <Badge 
                      variant={selectedZone.intensity > 0.7 ? "destructive" : 
                              selectedZone.intensity > 0.5 ? "default" : "secondary"}
                    >
                      {getIntensityLabel(selectedZone.intensity)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Koordinat</span>
                  <p className="text-sm font-mono">
                    {selectedZone.lat.toFixed(4)}, {selectedZone.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Klik pada titik di peta untuk melihat detail
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveHeatmap;
