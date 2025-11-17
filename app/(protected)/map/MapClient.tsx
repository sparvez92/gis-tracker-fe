'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Printer, MapPin } from 'lucide-react';
import { BASEMAPS } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import MapFilters from '@/components/custom/MapFilters';

/* ---------- Assets / Icons (replace with your actual icons in public/icons) ---------- */
const iconA = L.icon({
  iconUrl: '/icons/marker-blue.svg',
  iconSize: [15, 15],
  iconAnchor: [15, 15],
});
const iconB = L.icon({
  iconUrl: '/icons/marker-green.svg',
  iconSize: [15, 15],
  iconAnchor: [15, 15],
});
const iconC = L.icon({
  iconUrl: '/icons/marker-red.svg',
  iconSize: [15, 15],
  iconAnchor: [15, 15],
});

/* ---------------- Dummy markers ---------------- */
const DUMMY_MARKERS = [
  { id: 1, name: 'Project A', lat: 24.8607, lng: 67.0011, type: 'A' },
  { id: 2, name: 'Project B', lat: 25.396, lng: 68.3578, type: 'B' },
  { id: 3, name: 'Project C', lat: 33.6844, lng: 73.0479, type: 'C' },
];

function CustomPopup({ data, onClose }: { data: any; onClose: () => void }) {
  return (
    <Popup offset={[0, 0]} className="custom-popup" closeOnClick>
      <div className="w-[270px] overflow-hidden rounded-2xl shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1E1B58] px-4 py-5 text-white">
          <h3 className="text-lg font-semibold">Brooklyy</h3>
          <div className="flex items-center gap-2">
            <Printer size={26} className="cursor-pointer" />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 bg-white px-8 py-8">
          <div className="flex justify-between">
            <span className="text-primary text-sm font-semibold">Permit # :</span>
            <span className="font-medium">{data.permit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary text-sm font-semibold">Year :</span>
            <span>{data.year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary text-sm font-semibold">Town :</span>
            <span>{data.town}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary text-sm font-semibold">Start Date :</span>
            <span>{data.start}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary text-sm font-semibold">End Date :</span>
            <span>{data.end}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary text-sm font-semibold">Restoration Date :</span>
            <span>{data.restore}</span>
          </div>
        </div>
      </div>
    </Popup>
  );
}

/* ---------- MapInitializer: obtains map instance via useMap and passes it up ---------- */
function MapInitializer({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
    // attach a couple of default handlers so locate/controls behave well
    const onLocate = (e: L.LocationEvent) => {
      // nothing here, user logic handled where map instance is held
    };
    map.on('locationfound', onLocate);
    return () => {
      map.off('locationfound', onLocate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);
  return null;
}

/* ---------- Optional: show user's found location marker (listens to locate event) ---------- */
function UserLocationMarker({ map, coords }: { map: L.Map | null; coords: L.LatLng | null }) {
  // if coords updated externally, show marker
  if (!map || !coords) return null;
  return <Marker position={coords} icon={MapPin as unknown as L.Icon<L.IconOptions>}></Marker>;
}

function LocateButton({ map }: { map: L.Map }) {
  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 15);
        L.marker([latitude, longitude]).addTo(map).bindPopup('You are here').openPopup();
      },
      () => alert('Unable to retrieve your location')
    );
  };

  useEffect(() => {
    const button = L.DomUtil.create('button', '');
    button.innerHTML = '📍';
    button.title = 'Find Me';
    button.style.background = '#fff';
    button.style.border = 'none';
    button.style.width = '34px';
    button.style.height = '34px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '6px';
    button.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    button.style.zIndex = '99999999';
    button.style.cursor = 'pointer';
    button.style.pointerEvents = 'auto';

    const container = L.DomUtil.create('div', '');
    container.className = 'leaflet-bottom leaflet-left mt-20';
    container.style.padding = '10px';
    container.appendChild(button);

    const mapContainer = map.getContainer();
    mapContainer.appendChild(container);

    button.onclick = handleLocate;

    return () => {
      mapContainer.removeChild(container);
    };
  }, [map]);

  return null;
}

/* ---------- Main Component ---------- */
export default function MapClient() {
  const [map, setMap] = useState<L.Map | null>(null); // will be set by MapInitializer
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [userCoords, setUserCoords] = useState<L.LatLng | null>(null);
  const { baseMap: basemapKey } = useAuthStore();

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const googleScriptLoaded = useRef(false);

  /* ---------- Load Google Maps JS script (Places library) ---------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (googleScriptLoaded.current) return;

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set; Autocomplete will not work.');
      return;
    }

    const id = 'google-maps-places-script';
    if (document.getElementById(id)) {
      googleScriptLoaded.current = true;
      return;
    }

    const s = document.createElement('script');
    s.id = id;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    s.async = true;
    s.defer = true;
    s.onload = () => {
      googleScriptLoaded.current = true;
      // initialize autocomplete if input already exists
      initAutocomplete();
    };
    document.head.appendChild(s);

    return () => {
      /* do not remove script on unmount */
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initAutocomplete() {
    debugger;
    if (!searchInputRef.current) return;
    // guard for google
    // @ts-ignore
    if (typeof window === 'undefined' || !(window as any).google || !(window as any).google.maps)
      return;

    // @ts-ignore
    const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
      fields: ['geometry', 'name', 'formatted_address'],
      types: ['geocode', 'establishment'], // broad results
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      console.log('place ==>>', place);
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        console.log('lat,lng ==>>', lat, lng, map);
        if (map) {
          map.setView([lat, lng], 14, { animate: true });
        }
      } else {
        alert('Selected place has no location data.');
      }
    });
  }

  /* attempt init autocomplete when input ref becomes ready */
  useEffect(() => {
    if (!searchInputRef.current) return;
    if (typeof window != undefined && (window as any).google && (window as any).google.maps)
      initAutocomplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInputRef.current, map]);

  /* ---------- Locate Me logic ---------- */
  const handleLocate = () => {
    if (!map) {
      alert('Map not ready yet.');
      return;
    }
    map.locate({ setView: true, maxZoom: 15 });
    // use events to capture locationfound
    const onFound = (e: L.LocationEvent) => {
      setUserCoords(e.latlng);
      map.off('locationfound', onFound);
    };
    map.on('locationfound', onFound);

    const onError = () => {
      alert('Could not detect location. Please allow location access in your browser.');
      map.off('locationerror', onError);
    };
    map.on('locationerror', onError);
  };

  /* ---------- small helper to pick marker icon by type ---------- */
  const iconByType = (t: string) => {
    if (t === 'A') return iconA;
    if (t === 'B') return iconB;
    return iconC;
  };

  /* ---------- Render ---------- */
  return (
    <div className="flex h-screen flex-col">
      {/* <header className="z-20 flex items-center gap-4 bg-white p-3 shadow">

      </header> */}
      <div className="px-2">
        <MapFilters />
      </div>

      <div className="relative flex-1">
        <div className="absolute top-5 right-5 z-9999 bg-white">
          <input
            ref={(el) => {
              searchInputRef.current = el;
            }}
            type="search"
            placeholder="Search (Google Autocomplete)…"
            className="text-primary placeholder:text-placeholder z-9999 h-8 w-80 rounded border px-2 text-sm"
          />
        </div>
        <MapContainer center={[30.3753, 69.3451]} zoom={6} className="h-full w-full" maxZoom={20}>
          <MapInitializer onReady={(m) => setMap(m)} />

          <TileLayer
            url={BASEMAPS[basemapKey].url}
            subdomains={BASEMAPS[basemapKey].subdomains}
            attribution="&copy; OpenStreetMap contributors"
          />

          {map && <LocateButton map={map!} />}

          {DUMMY_MARKERS.map((mk) => (
            <Marker
              key={mk.id}
              position={[mk.lat, mk.lng]}
              icon={iconByType(mk.type)}
              eventHandlers={{
                click: () => setSelectedMarker(mk.id),
              }}
            >
              {selectedMarker === mk.id && <CustomPopup data={mk} onClose={() => {}} />}
            </Marker>
          ))}

          <UserLocationMarker map={map} coords={userCoords} />
        </MapContainer>
      </div>
    </div>
  );
}
