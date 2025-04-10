
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LayerType } from './MapView';

interface LayersPanelProps {
  activeLayers: LayerType[];
  onLayerToggle: (layer: LayerType) => void;
  onClose: () => void;
}

const LayersPanel = ({ activeLayers, onLayerToggle, onClose }: LayersPanelProps) => {
  return (
    <Card className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-lg p-4 w-64 z-10 backdrop-blur-sm border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Lapisan Peta</h3>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="h-6 w-6 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="tps" 
            checked={activeLayers.includes('tps')} 
            onCheckedChange={() => onLayerToggle('tps')}
          />
          <Label htmlFor="tps" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            Tempat Pembuangan Sampah
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="tps-liar" 
            checked={activeLayers.includes('tps-liar')} 
            onCheckedChange={() => onLayerToggle('tps-liar')}
          />
          <Label htmlFor="tps-liar" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            TPS Liar / Ilegal
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="bank-sampah" 
            checked={activeLayers.includes('bank-sampah')} 
            onCheckedChange={() => onLayerToggle('bank-sampah')}
          />
          <Label htmlFor="bank-sampah" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            Bank Sampah
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="tps3r" 
            checked={activeLayers.includes('tps3r')} 
            onCheckedChange={() => onLayerToggle('tps3r')}
          />
          <Label htmlFor="tps3r" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            TPS 3R
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="rute" 
            checked={activeLayers.includes('rute')} 
            onCheckedChange={() => onLayerToggle('rute')}
          />
          <Label htmlFor="rute" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            Rute Pengangkutan
          </Label>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
          Batasan Wilayah
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="kecamatan" 
              checked={activeLayers.includes('kecamatan')} 
              onCheckedChange={() => onLayerToggle('kecamatan')}
            />
            <Label htmlFor="kecamatan" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Batas Kecamatan
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="kelurahan" 
              checked={activeLayers.includes('kelurahan')} 
              onCheckedChange={() => onLayerToggle('kelurahan')}
            />
            <Label htmlFor="kelurahan" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Batas Kelurahan
            </Label>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LayersPanel;
