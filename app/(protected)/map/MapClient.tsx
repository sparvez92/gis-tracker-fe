'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Printer, MapPin } from 'lucide-react';
import { ALERT_TYPES, BASEMAPS } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import MapFilters from '@/components/custom/MapFilters';
import { formatMMDDYYYY, notify } from '@/lib/utils';
import { useProjectsQuery } from '@/graphql/queries/project.generated';
import { Enum_Project_Project_Type, Project } from '@/types';
import { downloadPdf, fetchProjectByType } from '@/lib/fetcher';
import Section from '@/components/custom/Section';

/* ---------- Assets / Icons (replace with your actual icons in public/icons) ---------- */
const GasEmergencyIcon = L.icon({
  iconUrl: '/icons/marker-blue.svg',
  iconSize: [15, 15],
  iconAnchor: [15, 15],
});
const PermitIcon = L.icon({
  iconUrl: '/icons/marker-green.svg',
  iconSize: [15, 15],
  iconAnchor: [15, 15],
});
const ElectricEmergencyIcon = L.icon({
  iconUrl: '/icons/marker-red.svg',
  iconSize: [15, 15],
  iconAnchor: [15, 15],
});

function CustomPopup({ data }: { data: Project; onClose: () => void }) {
  return (
    <Popup offset={[0, 0]} className="custom-popup" closeOnClick>
      <div className="w-[270px] overflow-hidden rounded-2xl shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1E1B58] px-4 py-5 text-white">
          <h3 className="text-lg font-semibold">{data.town}</h3>
          <div className="flex items-center gap-2">
            <Printer size={26} className="cursor-pointer" onClick={() => downloadPdf(data)} />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 bg-white px-8 py-8">
          <div className="flex justify-between">
            <span className="text-primary text-sm font-semibold">Permit # :</span>
            <span className="font-medium">{data.permit_no}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-primary text-sm font-semibold">Layout # :</span>
            <span className="font-medium">{data.layout_no}</span>
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
            <span>{data.const_start_date ? formatMMDDYYYY(data.const_start_date) : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary text-sm font-semibold">End Date :</span>
            <span>{data.const_end_date ? formatMMDDYYYY(data.const_end_date) : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary text-sm font-semibold">Restoration Start Date :</span>
            <span>{data.rest_start_date ? formatMMDDYYYY(data.rest_start_date) : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary text-sm font-semibold">Restoration End Date :</span>
            <span>{data.rest_end_date ? formatMMDDYYYY(data.rest_end_date) : '-'}</span>
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

    setTimeout(() => map.invalidateSize(), 100);
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
        L.marker([latitude, longitude])
          .addTo(map)
          .setIcon(
            L.icon({
              iconUrl: '/icons/location.png',
              iconSize: [32, 32], // Size of the icon (e.g., 32x32 pixels)
              iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location (e.g., center bottom)
              popupAnchor: [0, -32],
            })
          );
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
  const [selectedMarker, setSelectedMarker] = useState<string>('');
  const [projectByType, setProjectByType] = useState({
    totalPermit: 0,
    totalGas: 0,
    totalElectric: 0,
  });
  const [userCoords, setUserCoords] = useState<L.LatLng | null>(null);
  const { baseMap: basemapKey } = useAuthStore();

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const googleScriptLoaded = useRef(false);
  const [filters, setFilters] = useState<{
    search: string;
    year: string;
    projectType: Enum_Project_Project_Type | '';
  }>({
    search: '',
    year: '',
    projectType: '',
  });

  const { data: projectsData } = useProjectsQuery({
    pagination: {
      limit: 100000,
    },
    filters: {
      year: { eq: filters.year || undefined },
      project_type: { eq: filters.projectType || undefined },
      or: filters.search
        ? [
            {
              permit_no: { containsi: filters.search || undefined },
            },
            { layout_no: { containsi: filters.search || undefined } },
            { town: { containsi: filters.search || undefined } },
            { address: { containsi: filters.search || undefined } },
          ]
        : [],
    },
  });

  const projectsList = useMemo(() => {
    return projectsData?.projects_connection?.nodes || [];
  }, [projectsData]);

  /* ---------- Load Google Maps JS script (Places library) ---------- */
  useEffect(() => {
    getProjectByType();
  }, []);

  function initAutocomplete() {
    console.log({ searchInputRef });
    if (!searchInputRef.current) return;
    // guard for google
    // @ts-ignore
    if (typeof window === 'undefined' || !(window as any).google || !(window as any).google.maps)
      return;

    console.log('initAutocomplete called ===>>>');
    // @ts-ignore
    const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
      fields: ['geometry', 'name', 'formatted_address'],
      types: ['geocode', 'establishment'], // broad results
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
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

  const getProjectByType = () => {
    fetchProjectByType().then((res) => {
      setProjectByType({
        totalPermit: res.totalPermit || 0,
        totalGas: res.totalGas || 0,
        totalElectric: res.totalElectric || 0,
      });
    });
  };

  /* attempt init autocomplete when input ref becomes ready */
  useEffect(() => {
    if (!searchInputRef.current) return;
    if (typeof window != undefined && map) {
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


      setTimeout(() => {
        map?.invalidateSize?.();
      }, 500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInputRef.current, map]);

  /* ---------- small helper to pick marker icon by type ---------- */
  const iconByType = (t: Enum_Project_Project_Type) => {
    if (t === Enum_Project_Project_Type.GasEmergency) return GasEmergencyIcon;
    if (t === Enum_Project_Project_Type.ElectricEmergency) return ElectricEmergencyIcon;
    return PermitIcon;
  };

  /* ---------- Render ---------- */
  return (
    <div className="flex h-screen flex-col">
      {/* <header className="z-20 flex items-center gap-4 bg-white p-3 shadow">

      </header> */}
      <div className="flex gap-2 px-2 py-1">
        <MapFilters onFilterChange={setFilters} />

        {/* <Section>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-primary text-xs font-semibold">Total Permits</span>
              <span className="text-primary text-xs font-medium">{projectByType.totalPermit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary text-xs font-semibold">Total Gas Emergencies</span>
              <span className="text-primary text-xs font-medium">{projectByType.totalGas}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary text-xs font-semibold">Total Electric Emergencies</span>
              <span className="text-primary text-xs font-medium">
                {projectByType.totalElectric}
              </span>
            </div>
          </div>
        </Section> */}
      </div>

      <div className="relative flex-1">
        <div className="absolute top-5 right-5 z-20 bg-white">
          <input
            ref={(el) => {
              searchInputRef.current = el;
            }}
            type="search"
            placeholder="Search Location"
            className="text-primary placeholder:text-placeholder z-9999 h-8 w-80 rounded border px-2 text-sm"
          />
        </div>

        <Section className='absolute bottom-10 z-20 right-5'>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-primary text-xs font-semibold">Total Permits</span>
              <span className="text-primary text-xs font-medium">{projectByType.totalPermit}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-primary text-xs font-semibold">Total Gas Emergencies</span>
              <span className="text-primary text-xs font-medium">{projectByType.totalGas}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-primary text-xs font-semibold">Total Electric Emergencies</span>
              <span className="text-primary text-xs font-medium">
                {projectByType.totalElectric}
              </span>
            </div>
          </div>
        </Section>
        <MapContainer
          center={[40.6971934, -74.3091511]}
          zoom={6}
          className="h-full w-full"
          maxZoom={19}
        >
          <MapInitializer onReady={(m) => setMap(m)} />

          <TileLayer
            url={BASEMAPS[basemapKey].url}
            subdomains={BASEMAPS[basemapKey].subdomains}
            maxZoom={22}
            maxNativeZoom={19}
            updateWhenZooming={false}
            updateWhenIdle={true}
            keepBuffer={2}
          />

          {map && <LocateButton map={map!} />}

          {projectsList.map((mk) => (
            <Marker
              key={mk.documentId}
              position={[Number(mk.lat), Number(mk.lng)]}
              icon={iconByType(mk.project_type)}
              eventHandlers={{
                click: () => setSelectedMarker(mk.documentId),
              }}
            >
              {selectedMarker === mk.documentId && <CustomPopup data={mk} onClose={() => {}} />}
            </Marker>
          ))}

          <UserLocationMarker map={map} coords={userCoords} />
        </MapContainer>
      </div>
    </div>
  );
}
