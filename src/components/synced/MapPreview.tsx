// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/MapPreview.tsx
// Last synced: 2026-03-17T11:05:34.418Z
// API integrations stripped. Use props for data and callbacks.
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { LinkExternal01 } from '@untitledui/icons';
import { useState, useEffect } from 'react';

interface MapPreviewProps {
  lat: number;
  lng: number;
  mapUrl: string;
  height?: string;
  showOverlay?: boolean;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export function MapPreview({
  lat,
  lng,
  mapUrl,
  height = '200px',
  showOverlay = false,
}: MapPreviewProps) {
  const [hasError, setHasError] = useState(false);

  // Use the hook from @react-google-maps/api to handle script loading
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Set error state if loadError exists
  useEffect(() => {
    if (loadError) {
      console.error('Error loading Google Maps:', loadError);
      setHasError(true);
    }
  }, [loadError]);

  const mapContainerStyle = {
    width: '100%',
    height,
  };

  const handleMapClick = () => {
    window.open(mapUrl, '_blank');
  };

  // Fallback content while map is loading or if there's an error
  const renderPlaceholder = () => (
    <div
      style={{
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        padding: '1rem',
      }}
    >
      {hasError || loadError ? (
        <>
          <p className="mb-2 text-center text-red-600">Could not load map</p>
          <p className="text-center text-sm text-gray-600">
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-blue-600 underline"
          >
            Open in Google Maps
          </a>
        </>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );

  // If there's an error or no API key, show the placeholder with a link
  if (hasError || loadError || !GOOGLE_MAPS_API_KEY) {
    return (
      <div
        className="overflow-hidden rounded-lg border"
        title="Click to open in Google Maps"
        onClick={handleMapClick}
      >
        {renderPlaceholder()}
      </div>
    );
  }

  // Show placeholder while loading
  if (!isLoaded) {
    return (
      <div
        className="overflow-hidden rounded-lg border"
        title="Click to open in Google Maps"
      >
        {renderPlaceholder()}
      </div>
    );
  }

  // Map is loaded and ready to render
  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-lg border"
      title="Click to open in Google Maps"
      onClick={handleMapClick}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat, lng }}
        zoom={15}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>

      {showOverlay && (
        <div className="text-literata absolute bottom-0 left-0 flex items-center justify-center gap-2 rounded-lg bg-white p-2 text-sm">
          OPEN MAP <LinkExternal01 className="text-gray-600" />
        </div>
      )}
    </div>
  );
}
