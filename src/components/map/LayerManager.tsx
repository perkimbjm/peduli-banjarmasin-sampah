import { useState, useEffect, useMemo, MouseEvent } from "react";
import { LayerConfig, LayerGroup } from "./types";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, X, Droplets, Layers } from "lucide-react";
import { useRTData } from "@/contexts/RTDataContext";

interface LayerManagerProps {
  layerGroups: LayerGroup[];
  onLayerToggle: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  onRemoveUploadedLayer?: (layerId: string) => void;
}

// Grup yang akan ditampilkan expanded secara default
const DEFAULT_EXPANDED_GROUPS = ["batas-wilayah", "infrastruktur", "uploaded"];

const LayerManager = ({
  layerGroups,
  onLayerToggle,
  onLayerOpacityChange,
  onRemoveUploadedLayer,
}: LayerManagerProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]); // default collapsed
  const [expandedOpacity, setExpandedOpacity] = useState<string[]>([]); // layer IDs with expanded opacity slider
  const [isDragging, setIsDragging] = useState<boolean>(false); // State untuk mendeteksi drag pada slider

  // Deduplikasi layer groups berdasarkan ID untuk mencegah group duplicate
  const uniqueLayerGroups = useMemo(() => {
    // Gunakan Map untuk menyimpan group berdasarkan ID
    const groupMap = new Map<string, LayerGroup>();
    
    // Iterasi setiap group dan simpan hanya satu instance per ID
    layerGroups.forEach(group => {
      if (!groupMap.has(group.id)) {
        groupMap.set(group.id, group);
      }
    });
    
    // Konversi Map kembali ke array
    return Array.from(groupMap.values());
  }, [layerGroups]);

  // Set expanded groups saat pertama kali layerManager muncul
  useEffect(() => {
    // Filter hanya grup yang ada dalam DEFAULT_EXPANDED_GROUPS
    const initialExpandedGroups = uniqueLayerGroups
      .filter(group => DEFAULT_EXPANDED_GROUPS.includes(group.id))
      .map(group => group.id);
    
    setExpandedGroups(initialExpandedGroups);
  }, [uniqueLayerGroups]);

  const toggleGroup = (groupId: string) => {
    // Hanya toggle grup jika tidak sedang dalam drag operation
    if (!isDragging) {
      setExpandedGroups((prev) =>
        prev.includes(groupId)
          ? prev.filter((id) => id !== groupId)
          : [...prev, groupId]
      );
    }
    // Reset state drag
    setIsDragging(false);
  };

  const toggleOpacity = (layerId: string) => {
    setExpandedOpacity((prev) =>
      prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId]
    );
  };

  const handleBasemapToggle = (layerId: string) => {
    // Ensure only one basemap is visible at a time
    const basemapGroup = uniqueLayerGroups.find(group => group.id === 'basemap');
    if (basemapGroup) {
      basemapGroup.layers.forEach(layer => {
        if (layer.id !== layerId) {
          onLayerToggle(layer.id);
        }
      });
    }
    onLayerToggle(layerId);
  };

  const handleSliderMouseUp = () => {
    setIsDragging(false); // Reset state dragging saat mouse/touch dilepas
  };

  // Handler untuk slider touch/mouse events
  const handleSliderMouseDown = () => {
    setIsDragging(true);
  };

  const handleOpacityChange = (layerId: string, value: number) => {
    setIsDragging(true); // Set flag saat slider digeser
    onLayerOpacityChange(layerId, value / 100);
  };

  // Hentikan event propagation dari slider ke parent
  const handleSliderClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Layer Manager
      </h3>
      <div className="space-y-4">
        {uniqueLayerGroups.map((group) => (
          <div key={group.id} className="space-y-2">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white"
            >
              <span className="text-sm">{group.name}</span>
              {expandedGroups.includes(group.id) ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedGroups.includes(group.id) && (
              <div className="pl-4 space-y-2">
                {group.layers.map((layer) => (
                  <div key={layer.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {group.id === 'basemap' ? (
                          <input
                            type="radio"
                            id={`${group.id}-${layer.id}`}
                            name="basemap"
                            checked={layer.visible}
                            onChange={() => handleBasemapToggle(layer.id)}
                            className="h-4 w-4 text-peduli-600 focus:ring-peduli-500 border-gray-300 rounded"
                          />
                        ) : (
                          <Checkbox
                            id={`${group.id}-${layer.id}`}
                            checked={layer.visible}
                            onCheckedChange={() => onLayerToggle(layer.id)}
                          />
                        )}
                        <label
                          htmlFor={`${group.id}-${layer.id}`}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          {layer.name}
                        </label>
                      </div>
                      <div className="flex items-center space-x-1">
                        {layer.visible && (
                          <button
                            onClick={() => toggleOpacity(layer.id)}
                            className="text-gray-500 hover:text-blue-500 rounded-full h-6 w-6 flex items-center justify-center focus:outline-none"
                            title="Ubah Opacity"
                            aria-label="Ubah Opacity"
                          >
                            <Droplets className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {group.id === 'uploaded' && onRemoveUploadedLayer && (
                          <button
                            onClick={() => onRemoveUploadedLayer(layer.id)}
                            className="text-gray-500 hover:text-red-500"
                            title="Hapus Layer"
                            aria-label="Hapus Layer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {layer.visible && expandedOpacity.includes(layer.id) && (
                      <div 
                        className="pl-6 pt-1 pb-1" 
                        onClick={handleSliderClick}
                      >
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          Opacity
                        </label>
                        <Slider
                          value={[layer.opacity * 100]}
                          onValueChange={([value]) => handleOpacityChange(layer.id, value)}
                          onMouseDown={handleSliderMouseDown}
                          onMouseUp={handleSliderMouseUp}
                          onTouchStart={handleSliderMouseDown}
                          onTouchEnd={handleSliderMouseUp}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerManager; 