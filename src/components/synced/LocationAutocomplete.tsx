// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/LocationAutocomplete.tsx
// Last synced: 2026-03-17T11:05:34.416Z
// API integrations stripped. Use props for data and callbacks.
import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MarkerPin04 } from '@untitledui/icons';
import { ComboBox as UntitledComboBox } from '@/components/base/select/combobox';
import { SelectItem } from '@/components/base/select/select-item';
import { debounce } from 'lodash';
// [STRIPPED] import api from '@/lib/axios';
// [STRIPPED] import { universalApi } from '@/lib/universal';
interface Prediction {
  place_id: string;
  description: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: {
    placeId: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    venueId?: string;
  }) => void;
  placeholder?: string;
  showMapPreview?: boolean;
  className?: string;
  isInvalid?: boolean;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function LocationAutocomplete({
  value,
  onChange,
  onLocationSelect,
  placeholder = 'Search location...',
  showMapPreview = true,
  className,
  isInvalid = false,
}: LocationAutocompleteProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 });
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  const searchLocation = async (input: string) => {
    if (!input || input.trim().length < 5) {
      setPredictions([]);
      return;
    }

    try {
      const response = /* TODO: Manual review needed — api call stripped */ undefined;
      setPredictions(response.data.predictions || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    }
  };

  // Create a debounced version of searchLocation
  const debouncedSearchLocation = useCallback(
    debounce((input: string) => {
      searchLocation(input);
    }, 800),
    [],
  );

  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = /* TODO: Manual review needed — universalApi call stripped */ undefined;
      const data = response.data;

      if (data) {
        const location = {
          placeId: data.place_id,
          name: data.name,
          address: data.formatted_address,
          lat: data.latitude,
          lng: data.longitude,
          venueId: data.venue_id,
        };

        // Set the location coordinates for the map
        const coordinates = {
          lat: data.latitude,
          lng: data.longitude,
        };

        setSelectedLocation(coordinates);
        setMapCenter(coordinates);

        // Update the input value to show the location name or address
        // This ensures the input displays the selected location
        onChange(location.name || location.address);

        // Call onLocationSelect to notify parent component
        onLocationSelect(location);
        setOpen(false);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const mapContainerStyle = {
    width: '100%',
    height: '200px',
  };

  const handleGoogleMapsLoad = () => {
    setIsGoogleMapsLoaded(true);
  };

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearchLocation.cancel();
    };
  }, [debouncedSearchLocation]);

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <UntitledComboBox
        aria-label="Search location"
        placeholder={placeholder}
        inputValue={value}
        onInputChange={val => {
          onChange(val || '');
          debouncedSearchLocation(val || '');
        }}
        items={predictions.map(p => ({
          id: p.place_id,
          label: p.description,
          icon: MarkerPin04,
        }))}
        popoverClassName="max-h-80 overflow-y-auto"
        shortcut={false}
        size='md'
        isInvalid={isInvalid}
        allowsCustomValue={true}
      >
        {item => (
          <SelectItem
            id={item.id}
            key={item.id}
            label={item.label}
            icon={MarkerPin04}
            onAction={() => {
              // Don't call onChange here - let getPlaceDetails handle it via onLocationSelect
              // This prevents clearing selectedLocationObj before the full location data is available
              getPlaceDetails(item.id);
            }}
          />
        )}
      </UntitledComboBox>

      {showMapPreview && selectedLocation && (
        <div className="overflow-hidden rounded-lg border">
          <LoadScript
            googleMapsApiKey={GOOGLE_MAPS_API_KEY!}
            onLoad={handleGoogleMapsLoad}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={15}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {isGoogleMapsLoaded && (
                <Marker
                  position={selectedLocation}
                  animation={google.maps.Animation.DROP}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      )}
    </div>
  );
}
