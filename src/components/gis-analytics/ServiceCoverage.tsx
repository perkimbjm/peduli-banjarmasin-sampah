
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const ServiceCoverage = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [bufferRadius, setBufferRadius] = useState([500]);
  const [coverageStats, setCoverageStats] = useState({
    covered: 87.5,
    uncovered: 12.5,
    totalPopulation: 675000,
    coveredPopulation: 590625,
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([-3.3194, 114.5921], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    // Clear existing layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Circle || layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Mock facility locations
    const facilities = [
      { lat: -3.3194, lng: 114.5921, type: 'TPS' },
      { lat: -3.3240, lng: 114.5930, type: 'Bank Sampah' },
      { lat: -3.3280, lng: 114.5891, type: 'TPS 3R' },
      { lat: -3.3150, lng: 114.5950, type: 'TPS' },
      { lat: -3.3320, lng: 114.5980, type: 'Bank Sampah' },
    ];

    // Add facilities and coverage buffers
    facilities.forEach((facility) => {
      // Add facility marker
      const marker = L.marker([facility.lat, facility.lng])
        .bindPopup(`<strong>${facility.type}</strong><br/>Radius cakupan: ${bufferRadius[0]}m`);
      
      if (mapRef.current) {
        marker.addTo(mapRef.current);
      }

      // Add coverage buffer
      const circle = L.circle([facility.lat, facility.lng], {
        radius: bufferRadius[0],
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.1,
        weight: 2,
      });

      if (mapRef.current) {
        circle.addTo(mapRef.current);
      }
    });

    // Update coverage statistics based on buffer radius
    const baseCoverage = 87.5;
    const radiusEffect = (bufferRadius[0] - 500) / 1000; // Effect of radius change
    const newCoverage = Math.min(95, Math.max(60, baseCoverage + radiusEffect * 10));
    
    setCoverageStats({
      covered: newCoverage,
      uncovered: 100 - newCoverage,
      totalPopulation: 675000,
      coveredPopulation: Math.round(675000 * (newCoverage / 100)),
    });

  }, [bufferRadius]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Analisis Cakupan Layanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Radius Buffer (meter)</label>
                <div className="mt-2">
                  <Slider
                    value={bufferRadius}
                    onValueChange={setBufferRadius}
                    max={1500}
                    min={300}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>300m</span>
                    <span>{bufferRadius[0]}m</span>
                    <span>1500m</span>
                  </div>
                </div>
              </div>
              
              <div ref={mapContainerRef} className="h-[400px] w-full rounded-lg border" />
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full opacity-30"></div>
                  <span>Area Terlayani</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Fasilitas</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Statistik Cakupan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Populasi Terlayani</span>
                <Badge variant="secondary">
                  {coverageStats.covered.toFixed(1)}%
                </Badge>
              </div>
              <div className="text-2xl font-bold">
                {coverageStats.coveredPopulation.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                dari {coverageStats.totalPopulation.toLocaleString()} total penduduk
              </div>
            </div>

            <div className="border-t pt-4">
              <span className="text-sm text-muted-foreground">Populasi Belum Terlayani</span>
              <div className="text-lg font-semibold text-red-600">
                {(coverageStats.totalPopulation - coverageStats.coveredPopulation).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {coverageStats.uncovered.toFixed(1)}% dari total
              </div>
            </div>

            <div className="border-t pt-4">
              <span className="text-sm text-muted-foreground">Rekomendasi</span>
              <div className="text-sm mt-1">
                {coverageStats.covered < 80 ? (
                  <p className="text-red-600">Perlu penambahan fasilitas di area yang belum terlayani</p>
                ) : coverageStats.covered < 90 ? (
                  <p className="text-yellow-600">Cakupan baik, dapat dioptimalkan lebih lanjut</p>
                ) : (
                  <p className="text-green-600">Cakupan layanan sangat baik</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceCoverage;
