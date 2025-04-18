import { useMap } from "react-leaflet";
import { useState, useRef } from "react";
import L from "leaflet";
import MapButton from "@/components/ui/MapButton";
import { Layers } from "lucide-react";

interface Basemap {
  name: string;
  url: string;
  attribution: string;
}

const basemaps: Basemap[] = [
  {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
  {
    name: "Topographic",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
  },
  {
    name: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  }
];

const BasemapSelector = () => {
  const map = useMap();
  const [currentBasemap, setCurrentBasemap] = useState<string>("OpenStreetMap");
  const [isOpen, setIsOpen] = useState(false);
  const currentLayerRef = useRef<L.TileLayer | null>(null);

  const changeBasemap = (basemap: Basemap) => {
    // Hapus layer lama jika ada
    if (currentLayerRef.current) {
      map.removeLayer(currentLayerRef.current);
    }

    // Buat dan tambahkan layer baru
    const newLayer = L.tileLayer(basemap.url, {
      attribution: basemap.attribution,
    });
    newLayer.addTo(map);
    
    // Simpan referensi layer baru
    currentLayerRef.current = newLayer;
    setCurrentBasemap(basemap.name);
    setIsOpen(false);
  };

  return (
    <div className="leaflet-control-container">
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control leaflet-bar">
          <MapButton
            icon={Layers}
            onClick={() => setIsOpen(!isOpen)}
            tooltip="Pilih Basemap"
          />
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
              <div className="py-1">
                {basemaps.map((basemap) => (
                  <button
                    key={basemap.name}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      currentBasemap === basemap.name
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => changeBasemap(basemap)}
                  >
                    {basemap.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasemapSelector; 