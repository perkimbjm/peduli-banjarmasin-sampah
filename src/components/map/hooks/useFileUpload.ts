import { useCallback } from 'react';
import L from 'leaflet';
import { useToast } from '@/hooks/use-toast';
import { LayerConfig } from '../types';
import Papa from 'papaparse';
import wellknown from 'wellknown';
import shp from 'shpjs';
import { kml as toGeoJSONKML } from '@tmcw/togeojson';

export const useFileUpload = (
  map: L.Map | null, 
  onFileUpload: (file: File, layerConfig: LayerConfig) => void
) => {
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!map) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const layerId = file.name;
    const layerName = file.name.split('.').slice(0, -1).join('.') || file.name;

    try {
      let geojson: any = null;
      if (fileExtension === 'geojson' || fileExtension === 'json') {
        // GeoJSON
        const text = await file.text();
        geojson = JSON.parse(text);
      } else if (fileExtension === 'csv') {
        // CSV to GeoJSON
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true });
        if (!parsed.data || parsed.data.length === 0) throw new Error('CSV kosong atau tidak valid');
        // Coba deteksi kolom lat/lon
        const latKey = Object.keys(parsed.data[0]).find(k => k.toLowerCase().includes('lat'));
        const lonKey = Object.keys(parsed.data[0]).find(k => k.toLowerCase().includes('lon') || k.toLowerCase().includes('lng'));
        if (!latKey || !lonKey) throw new Error('CSV harus punya kolom latitude dan longitude');
        geojson = {
          type: 'FeatureCollection',
          features: parsed.data.filter((r: any) => r[latKey] && r[lonKey]).map((row: any) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [parseFloat(row[lonKey]), parseFloat(row[latKey])]
            },
            properties: { ...row }
          }))
        };
      } else if (fileExtension === 'kml') {
        // KML to GeoJSON
        const text = await file.text();
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(text, 'application/xml');
        geojson = toGeoJSONKML(kmlDoc);
      } else if (fileExtension === 'wkt') {
        // WKT to GeoJSON
        const text = await file.text();
        const geometry = wellknown(text.trim());
        geojson = {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry,
            properties: {}
          }]
        };
      } else if (fileExtension === 'zip' || fileExtension === 'shp') {
        // SHP (zip) to GeoJSON
        const arrayBuffer = await file.arrayBuffer();
        const result = await shp(arrayBuffer);
        if (result.type === 'FeatureCollection') {
          geojson = result;
        } else if (Array.isArray(result)) {
          geojson = { type: 'FeatureCollection', features: result.flatMap((fc: any) => fc.features) };
        } else {
          throw new Error('Tidak dapat membaca file SHP');
        }
      } else {
        throw new Error('Format file tidak didukung');
      }

      // Buat layer leaflet
      const geoJSONLayer = L.geoJSON(geojson, {
        style: {
          color: '#ff7800',
          weight: 2,
          opacity: 0.65,
          fillOpacity: 0.2,
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties) {
            layer.bindPopup(
              Object.entries(feature.properties)
                .map(([key, value]) => `${key}: ${value}`)
                .join('<br>')
            );
          }
        }
      });

      const layerConfig: LayerConfig = {
        id: layerId,
        name: layerName,
        type: 'geojson',
        visible: true,
        opacity: 0.65,
        group: 'uploaded',
        data: JSON.stringify(geojson),
        style: {
          color: '#ff7800',
          weight: 2,
          opacity: 0.65,
          fillOpacity: 0.2,
        }
      };

      onFileUpload(file, layerConfig);

      toast({
        title: 'Success',
        description: `File ${file.name} uploaded successfully`,
      });
    } catch (error: any) {
      console.error('Error parsing file:', error);
      toast({
        title: 'Error',
        description: error.message || 'Invalid file',
        variant: 'destructive',
      });
    }
  }, [map, onFileUpload, toast]);

  return handleFileUpload;
};
