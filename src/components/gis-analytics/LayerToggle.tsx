
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Building2, AlertTriangle, Recycle, Route, Shield } from "lucide-react";

interface LayerToggleProps {
  activeLayers: string[];
  onLayerToggle: (layer: string) => void;
}

const LayerToggle = ({ activeLayers, onLayerToggle }: LayerToggleProps) => {
  const layers = [
    { id: 'tps', name: 'TPS Reguler', icon: MapPin, color: 'text-blue-600' },
    { id: 'tps3r', name: 'TPS 3R', icon: Recycle, color: 'text-green-600' },
    { id: 'waste-banks', name: 'Bank Sampah', icon: Building2, color: 'text-purple-600' },
    { id: 'illegal-tps', name: 'TPS Liar', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'truck-routes', name: 'Rute Truk', icon: Route, color: 'text-orange-600' },
    { id: 'districts', name: 'Batas Kecamatan', icon: Shield, color: 'text-gray-600' },
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-sm">Layer Peta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {layers.map((layer) => (
          <div key={layer.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <layer.icon className={`h-4 w-4 ${layer.color}`} />
              <Label htmlFor={layer.id} className="text-sm font-normal">
                {layer.name}
              </Label>
            </div>
            <Switch
              id={layer.id}
              checked={activeLayers.includes(layer.id)}
              onCheckedChange={() => onLayerToggle(layer.id)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LayerToggle;
