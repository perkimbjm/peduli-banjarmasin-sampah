
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-polylinedecorator';

// Icon assets
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon path issues in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Type definition for polylineDecorator and Symbol
declare module 'leaflet' {
  export function polylineDecorator(
    polyline: L.Polyline, 
    options: any
  ): L.Layer;
  
  export namespace Symbol {
    export function arrowHead(options: any): any;
  }
}

// Create custom colored marker icons
export const createColoredIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    iconRetinaUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Base map layers
export const getBaseMaps = () => {
  return {
    "Street": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }),
    "Satellite": L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google Maps',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }),
    "Terrain": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
      maxZoom: 17,
    }),
    "Dark": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    })
  };
};

// Custom legend control
export const createLegendControl = () => {
  const LegendControl = L.Control.extend({
    options: {
      position: 'bottomleft'
    },
    onAdd: function() {
      const div = L.DomUtil.create('div', 'legend bg-white/90 p-2 rounded shadow-md text-xs border border-gray-300');
      div.innerHTML = `
        <div class="font-semibold mb-1">Legenda</div>
        <div class="flex items-center gap-1"><span class="w-3 h-3 inline-block bg-blue-500 rounded-full"></span> TPS</div>
        <div class="flex items-center gap-1"><span class="w-3 h-3 inline-block bg-red-500 rounded-full"></span> TPS Liar</div>
        <div class="flex items-center gap-1"><span class="w-3 h-3 inline-block bg-green-500 rounded-full"></span> Bank Sampah</div>
        <div class="flex items-center gap-1"><span class="w-3 h-3 inline-block bg-purple-500 rounded-full"></span> TPS 3R</div>
      `;
      return div;
    }
  });
  
  return new LegendControl();
};
