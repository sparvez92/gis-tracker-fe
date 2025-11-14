'use client';

import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { GoogleMap, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api';
import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
};

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
};

const defaultCenter = {
  lat: 31.5204, // Default Pakistan coordinates
  lng: 74.3587,
};

const LocationPickerField = <T extends FieldValues>({ form, name, label }: Props<T>) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  const [position, setPosition] = useState(defaultCenter);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setPosition(newPosition);
        form.setValue(name, {
          address: place.formatted_address,
          lat: newPosition.lat,
          lng: newPosition.lng,
        } as any);
      }
    }
  }, [form, name]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setPosition({ lat, lng });
      form.setValue(name, { lat, lng, address: '' } as any);
    }
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className="w-full space-y-2">
          {label && <FormLabel className="text-primary text-sm font-medium">{label}</FormLabel>}
          <FormControl>
            <div className="space-y-2">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <Input
                  placeholder="Type location here"
                  className={cn(
                    'border-border bg-input-bg placeholder:text-placeholder h-14 rounded-lg border text-lg font-semibold text-gray-600 focus-visible:border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-300'
                  )}
                />
              </Autocomplete>

              {/* <GoogleMap
                mapContainerStyle={containerStyle}
                center={position}
                zoom={6}
                onClick={handleMapClick}
                options={{
                  fullscreenControl: false,
                  streetView: 
                }}
              >
                <Marker position={position} draggable />
              </GoogleMap> */}

              <GoogleMap
                mapContainerStyle={containerStyle}
                center={position}
                zoom={6}
                options={{
                  disableDefaultUI: false, // removes all default buttons (fullscreen, zoom, map type)
                  zoomControl: false, // extra safety — disables zoom buttons
                  streetViewControl: false, // disables street view pegman
                  fullscreenControl: true, // disables fullscreen button
                  draggable: true, // allow dragging,
                  draggableCursor: 'pointer',
                  draggingCursor: 'grabbing',
                  scrollwheel: true, // allow zoom with scroll
                }}
                onClick={handleMapClick}
              >
                <Marker position={position} />
              </GoogleMap>
            </div>
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default LocationPickerField;
