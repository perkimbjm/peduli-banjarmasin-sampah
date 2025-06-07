
import L from 'leaflet';

declare global {
  interface Window {
    mapLayers: { [key: string]: L.Layer };
    L: typeof L;
  }
}

declare module 'leaflet' {
  namespace Control {
    interface Geocoder {
      nominatim(): any;
      (options?: any): any;
    }
  }
}

export {};
