
import { useCallback } from 'react';
import L from 'leaflet';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = (
  map: L.Map | null, 
  onFileUpload: (file: File) => void
) => {
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!map) return;
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          const geoJSONLayer = L.geoJSON(data, {
            style: {
              color: "#ff7800",
              weight: 2,
              opacity: 0.65,
              fillOpacity: 0.2,
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                layer.bindPopup(
                  Object.entries(feature.properties)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join("<br>")
                );
              }
            }
          });
          
          geoJSONLayer.addTo(map);
          onFileUpload(file);
          
          toast({
            title: "Success",
            description: `File ${file.name} uploaded successfully`,
          });
        } catch (error) {
          console.error("Error parsing GeoJSON:", error);
          toast({
            title: "Error",
            description: "Invalid GeoJSON file",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error reading file:", error);
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive",
      });
    }
  }, [map, onFileUpload, toast]);

  return handleFileUpload;
};
