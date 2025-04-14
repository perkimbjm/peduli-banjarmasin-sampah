
import { Card, CardContent } from "@/components/ui/card";
import MapView from "@/components/webgis/MapView";
import { LayerType } from "@/components/webgis/data/mock-map-data";

interface MapDisplayProps {
  activeLayers: LayerType[];
}

const MapDisplay = ({ activeLayers }: MapDisplayProps) => {
  return (
    <Card className="border rounded-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="h-[600px]">
          <MapView 
            activeLayers={activeLayers} 
            fullscreenMode={false}
            splitViewEnabled={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapDisplay;
