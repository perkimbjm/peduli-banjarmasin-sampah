import "leaflet";
import "leaflet-easybutton";
import "leaflet-fullscreen";
import "leaflet-omnivore";

declare module "leaflet" {
  namespace Control {
    interface FullscreenOptions {
      position?: ControlPosition;
      title?: string;
      titleCancel?: string;
    }

    interface LocateOptions {
      position?: ControlPosition;
      strings?: {
        title?: string;
        popup?: string;
        outsideMapBoundsMsg?: string;
      };
    }

    interface GeocoderOptions {
      position?: ControlPosition;
      placeholder?: string;
      defaultMarkGeocode?: boolean;
    }

    interface FileLayerLoadOptions {
      position?: ControlPosition;
      fitBounds?: boolean;
      layerOptions?: L.GeoJSONOptions;
    }

    class Fullscreen extends Control {
      constructor(options?: FullscreenOptions);
    }

    class Locate extends Control {
      constructor(options?: LocateOptions);
    }

    class Geocoder extends Control {
      constructor(options?: GeocoderOptions);
    }

    class FileLayerLoad extends Control {
      constructor(options?: FileLayerLoadOptions);
    }
  }
} 