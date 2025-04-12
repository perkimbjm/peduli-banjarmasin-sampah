import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix untuk icon default Leaflet
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icon untuk lokasi saat ini
const currentLocationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Basemap options
const basemaps = {
  "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }),
  "Satellite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }),
  "Topography": L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }),
  "Dark": L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }),
};

interface MapPelaporanProps {
  location: { lat: number; lng: number };
  onLocationChange: (loc: { lat: number; lng: number }) => void;
}

const MapPelaporan = ({ location, onLocationChange }: MapPelaporanProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const currentLocationMarkerRef = useRef<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Inisialisasi peta
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Buat instance peta jika belum ada
    if (!mapInstanceRef.current) {
      // Hapus pembagian default zoom control dari Leaflet yang ada di kiri atas
      const map = L.map(mapContainerRef.current, {
        zoomControl: false, // Disable default zoom control
        attributionControl: false, // We'll add a custom attribution later
      }).setView([location.lat, location.lng], 13);
      
      // Tambahkan basemap default
      basemaps["OpenStreetMap"].addTo(map);
      
      // Tambahkan attribution control di pojok kanan bawah
      L.control.attribution({
        position: 'bottomright'
      }).addTo(map);

      // Event handler untuk klik pada peta
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onLocationChange({ lat, lng });
      });

      // Tambahkan kontrol zoom di pojok kanan bawah
      L.control.zoom({
        position: "bottomright"
      }).addTo(map);

      // Tambahkan kontrol layer untuk basemap di pojok kanan atas sebagai radio buttons
      const BasemapControl = L.Control.extend({
        options: {
          position: 'topright'
        },
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control basemap-control');
          container.style.background = 'white';
          container.style.padding = '8px';
          container.style.borderRadius = '4px';
          container.style.marginBottom = '10px'; // Jarak aman dari tombol fullscreen
          container.style.width = '150px';
          
          // Judul untuk kontrol basemap
          const title = document.createElement('div');
          title.textContent = 'Basemap';
          title.style.cssText = 'font-weight: bold; margin-bottom: 6px; font-size: 12px;';
          container.appendChild(title);
          
          // Container untuk radio buttons
          const radioContainer = document.createElement('div');
          radioContainer.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';
          
          // Menerapkan dark mode styles jika diperlukan
          if (document.documentElement.classList.contains('dark')) {
            container.style.background = '#1f2937'; // bg-gray-800
            container.style.color = 'white';
            container.style.borderColor = '#374151'; // border-gray-700
          }
          
          // Stop propagation untuk mencegah klik map
          L.DomEvent.disableClickPropagation(container);
          L.DomEvent.disableScrollPropagation(container);
          
          // Simpan referensi ke radio button aktif
          let activeBasemap = "OpenStreetMap";
          
          // Menambahkan radio buttons untuk setiap basemap
          Object.keys(basemaps).forEach(name => {
            const radioOption = document.createElement('label');
            radioOption.style.cssText = 'display: flex; align-items: center; font-size: 12px; cursor: pointer; padding: 2px 0;';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'basemap';
            radio.value = name;
            radio.style.cssText = 'margin-right: 6px;';
            
            // Set default selected
            if (name === activeBasemap) {
              radio.checked = true;
            }
            
            const radioLabel = document.createElement('span');
            radioLabel.textContent = name;
            
            // Apply dark/light mode styles
            if (document.documentElement.classList.contains('dark')) {
              radioOption.style.backgroundColor = '#1f2937'; // bg-gray-800
              radioOption.style.color = 'white';
              radioLabel.style.color = 'white';
            } else {
              radioOption.style.backgroundColor = 'white';
              radioOption.style.color = 'black';
              radioLabel.style.color = 'black';
            }
            
            radioOption.appendChild(radio);
            radioOption.appendChild(radioLabel);
            
            // Handle change event
            radio.addEventListener('change', function() {
              if (this.checked) {
                // Update active basemap
                activeBasemap = name;
                
                // Remove all tile layers
                Object.values(basemaps).forEach(layer => {
                  if (map.hasLayer(layer)) {
                    map.removeLayer(layer);
                  }
                });
                
                // Add selected layer
                basemaps[name as keyof typeof basemaps].addTo(map);
              }
            });
            
            radioContainer.appendChild(radioOption);
          });
          
          container.appendChild(radioContainer);
          return container;
        }
      });
      
      new BasemapControl().addTo(map);

      // Fullscreen control dengan posisi yang tidak bertabrakan
      const FullscreenControl = L.Control.extend({
        options: {
          position: 'topleft'
        },
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          const button = L.DomUtil.create('a', '', container);
          button.href = '#';
          button.title = 'Fullscreen';
          button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          `;
          button.style.display = 'flex';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';
          button.style.width = '30px';
          button.style.height = '30px';
          
          // Apply dark mode styles if needed
          if (document.documentElement.classList.contains('dark')) {
            button.style.background = '#1f2937'; // bg-gray-800
            button.style.color = 'white';
            button.style.borderColor = '#374151'; // border-gray-700
          }
          
          button.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleFullscreen();
            return false;
          };
          
          return container;
        }
      });
      
      new FullscreenControl().addTo(map);

      // Tambahkan tombol GPS
      const GPSControl = L.Control.extend({
        options: {
          position: 'bottomright'
        },
        onAdd: function(map: L.Map) {
          const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
          div.innerHTML = `<a 
            class="leaflet-control-locate" 
            href="#" 
            title="Lokasi Saat Ini" 
            role="button" 
            aria-label="Lokasi Saat Ini"
            style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; background-color: white; font-size: 15px;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="1"></circle>
              <line x1="12" y1="2" x2="12" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
            </svg>
          </a>`;
          
          div.onclick = function() {
            setIsLocating(true);
            locateUser(map);
            return false;
          };
          
          return div;
        }
      });

      new GPSControl().addTo(map);

      mapInstanceRef.current = map;
    }

    // Update posisi peta saat lokasi berubah
    mapInstanceRef.current.setView([location.lat, location.lng], 13);

    // Update marker saat lokasi berubah atau buat marker baru jika belum ada
    if (markerRef.current) {
      markerRef.current.setLatLng([location.lat, location.lng]);
    } else {
      markerRef.current = L.marker([location.lat, location.lng], { 
        icon: defaultIcon,
        draggable: true
      }).addTo(mapInstanceRef.current);

      // Tambahkan event listener untuk drag marker
      markerRef.current.on('dragend', function(event) {
        const marker = event.target;
        const position = marker.getLatLng();
        onLocationChange({ lat: position.lat, lng: position.lng });
      });
    }

    // Invalidate map size when container size changes (like when toggling fullscreen)
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }

    // Cleanup pada unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        currentLocationMarkerRef.current = null;
      }
    };
  }, [location, onLocationChange, isFullscreen]);

  // Fungsi untuk mendapatkan lokasi pengguna saat ini
  const locateUser = (map: L.Map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          
          // Tampilkan posisi saat ini dengan marker khusus
          if (currentLocationMarkerRef.current) {
            currentLocationMarkerRef.current.setLatLng([lat, lng]);
          } else {
            currentLocationMarkerRef.current = L.marker([lat, lng], {
              icon: currentLocationIcon
            }).addTo(map)
              .bindPopup("Lokasi Anda saat ini")
              .openPopup();
          }
          
          // Zoom ke lokasi saat ini
          map.setView([lat, lng], 16);
          
          // Tanya apakah pengguna ingin menggunakan lokasi ini
          const useLocationButton = L.DomUtil.create("button", "");
          useLocationButton.innerHTML = "Gunakan lokasi ini";
          useLocationButton.style.cssText = "margin-top: 10px; padding: 5px 10px; background-color: #3085d6; color: white; border: none; border-radius: 4px; cursor: pointer;";
          
          // Tambahkan tombol ke popup
          const popupContent = document.createElement("div");
          popupContent.appendChild(document.createTextNode("Lokasi Anda saat ini"));
          popupContent.appendChild(document.createElement("br"));
          popupContent.appendChild(useLocationButton);
          
          currentLocationMarkerRef.current.getPopup().setContent(popupContent);
          
          // Tambahkan event listener pada tombol
          useLocationButton.addEventListener("click", () => {
            onLocationChange({ lat, lng });
            currentLocationMarkerRef.current?.closePopup();
          });
          
          setIsLocating(false);
        },
        (error) => {
          console.error("Error mendapatkan lokasi:", error);
          let errorMessage: string;
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Akses lokasi ditolak oleh pengguna.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Informasi lokasi tidak tersedia.";
              break;
            case error.TIMEOUT:
              errorMessage = "Waktu permintaan lokasi habis.";
              break;
            default:
              errorMessage = "Terjadi kesalahan saat mendapatkan lokasi.";
          }
          
          alert(errorMessage);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolokasi tidak didukung oleh browser Anda.");
      setIsLocating(false);
    }
  };

  // Toggle fullscreen function
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    if (!isFullscreen) {
      // Entering fullscreen
      const mapContainer = mapContainerRef.current?.parentElement;
      if (mapContainer) {
        // Save current styles for restoration
        mapContainer.setAttribute('data-original-position', mapContainer.style.position || '');
        mapContainer.setAttribute('data-original-height', mapContainer.style.height || '');
        mapContainer.setAttribute('data-original-width', mapContainer.style.width || '');
        mapContainer.setAttribute('data-original-zindex', mapContainer.style.zIndex || '');
        
        // Apply fullscreen styles
        mapContainer.style.position = 'fixed';
        mapContainer.style.top = '0';
        mapContainer.style.left = '0';
        mapContainer.style.width = '100vw';
        mapContainer.style.height = '100vh';
        mapContainer.style.zIndex = '9999';
        mapContainer.style.background = 'white';
        
        if (document.documentElement.classList.contains('dark')) {
          mapContainer.style.background = '#1f2937'; // bg-gray-800
        }
      }
    } else {
      // Exiting fullscreen
      const mapContainer = mapContainerRef.current?.parentElement;
      if (mapContainer) {
        // Restore original styles
        mapContainer.style.position = mapContainer.getAttribute('data-original-position') || '';
        mapContainer.style.height = mapContainer.getAttribute('data-original-height') || '';
        mapContainer.style.width = mapContainer.getAttribute('data-original-width') || '';
        mapContainer.style.zIndex = mapContainer.getAttribute('data-original-zindex') || '';
        mapContainer.style.top = '';
        mapContainer.style.left = '';
        mapContainer.style.background = '';
      }
    }
    
    // Wait for the DOM to update
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-[10000]">
          <button 
            onClick={() => toggleFullscreen()}
            className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
            title="Keluar dari mode fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M4 14h6m0 0v6m0-6l-7 7m17-11h-6m0 0V4m0 6l7-7"/>
            </svg>
          </button>
        </div>
      )}
      {isLocating && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/10 flex items-center justify-center z-[10000]">
          <div className="bg-white dark:bg-gray-800 dark:text-white p-3 rounded-md shadow-md">
            <p className="text-sm text-center">Mendapatkan lokasi...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPelaporan; 