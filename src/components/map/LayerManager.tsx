import { useState, useEffect } from "react";
import { LayerConfig, LayerGroup } from "./types";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface LayerManagerProps {
  layerGroups: LayerGroup[];
  onLayerToggle: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  onRemoveUploadedLayer?: (layerId: string) => void;
}

const LayerManager = ({
  layerGroups,
  onLayerToggle,
  onLayerOpacityChange,
  onRemoveUploadedLayer,
}: LayerManagerProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]); // default collapsed

  // Expand all groups when LayerManager appears (mounts or layerGroups change)
  useEffect(() => {
    setExpandedGroups(layerGroups.map(g => g.id));
  }, [layerGroups]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleBasemapToggle = (layerId: string) => {
    // Ensure only one basemap is visible at a time
    const basemapGroup = layerGroups.find(group => group.id === 'basemap');
    if (basemapGroup) {
      basemapGroup.layers.forEach(layer => {
        if (layer.id !== layerId) {
          onLayerToggle(layer.id);
        }
      });
    }
    onLayerToggle(layerId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Layer Manager
      </h3>
      <div className="space-y-4">
        {layerGroups.map((group) => (
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
                            id={layer.id}
                            name="basemap"
                            checked={layer.visible}
                            onChange={() => handleBasemapToggle(layer.id)}
                            className="h-4 w-4 text-peduli-600 focus:ring-peduli-500 border-gray-300 rounded"
                          />
                        ) : (
                          <Checkbox
                            id={layer.id}
                            checked={layer.visible}
                            onCheckedChange={() => onLayerToggle(layer.id)}
                          />
                        )}
                        <label
                          htmlFor={layer.id}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          {layer.name}
                        </label>
                      </div>
                      {group.id === 'uploaded' && onRemoveUploadedLayer && (
                        <button
                          onClick={() => onRemoveUploadedLayer(layer.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {layer.visible && (
                      <div className="pl-6">
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          Opacity
                        </label>
                        <Slider
                          value={[layer.opacity * 100]}
                          onValueChange={([value]) =>
                            onLayerOpacityChange(layer.id, value / 100)
                          }
                          max={100}
                          step={1}
                          className="w-full"
                        />
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