// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/LocationDetailsModal.tsx
// Last synced: 2026-03-17T11:17:27.004Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/base/buttons/button';
import { LocationAutocomplete } from '@/components/LocationAutocomplete';
import { TextEditor } from '@/components/base/text-editor/text-editor';
// [STRIPPED] import { fetchEventById } from '@/app/(events-and-wedding)/(events)/services/eventApi';
// [STRIPPED] 
interface LocationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: LocationData) => void;
  onAddLater: () => void;
  initialData?: Partial<LocationData>;
  showHeader?: boolean;
  eventId: string;
}

export interface LocationData {
  venueType: 'residence' | 'hall';
  location: string;
  directionalInstructions: string;
  needsMyGatePass: boolean;
  gatePassLink?: string;
  showGatePassLink?: boolean;
  selectedLocation?: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    lon?: number;
    venueId?: string;
    placeId: string;
  } | null;
}

export const LocationDetailsModal = ({
  isOpen,
  onClose,
  onConfirm,
  onAddLater,
  initialData,
  eventId,
}: LocationDetailsModalProps) => {
  const [venueType, setVenueType] = useState<'residence' | 'hall'>(
    initialData?.venueType || 'residence'
  );
  const [location, setLocation] = useState(initialData?.location || '');
  const [directionalInstructions, setDirectionalInstructions] = useState(
    initialData?.directionalInstructions || ''
  );
  const [selectedLocationObj, setSelectedLocationObj] = useState<{
    name: string;
    address: string;
    lat: number;
    lng: number;
    lon?: number;
    venueId?: string;
    placeId: string;
  } | null>(initialData?.selectedLocation || null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing event data to pre-populate location details
  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId || !isOpen) return;

      setIsLoading(true);
      try {
        const response = await /* [STRIPPED] fetchEventById call */ ((() => undefined) as any)();
        const event = response.event;

        // Pre-populate venue type from venue_name field
        const eventData = event as unknown;
        if (eventData.venue_name) {
          // venue_name should be 'residence' or 'hall'
          setVenueType(eventData.venue_name === 'hall' ? 'hall' : 'residence');
        }

        // Pre-populate location data if it exists
        if (event.venue_data) {
          const venueData = event.venue_data as unknown;

          // Set location name
          if (venueData.name) {
            setLocation(venueData.name);
          }

          // Set directional instructions from content_block
          if (event.content_block?.location_notes) {
            setDirectionalInstructions(event.content_block.location_notes);
          }

          // Set selected location object with coordinates
          if (venueData.lat && venueData.lon) {
            const lat = parseFloat(String(venueData.lat));
            const lng = parseFloat(String(venueData.lon));

            if (!isNaN(lat) && !isNaN(lng)) {
              setSelectedLocationObj({
                name: venueData.name || '',
                address: venueData.address_line1 || '',
                lat: lat,
                lng: lng,
                venueId: venueData.venue_id,
                placeId: venueData.places_id || '',
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, isOpen]);

  if (!isOpen) return null;

  // Handle location selection from autocomplete
  const handleLocationSelect = (loc: unknown) => {
    if (!loc) return;

    setLocation(loc.name || '');

    // Parse coordinates
    const latValue = loc.lat ? parseFloat(String(loc.lat)) :
      loc.latitude ? parseFloat(String(loc.latitude)) : null;
    const lngValue = loc.lng ? parseFloat(String(loc.lng)) :
      loc.longitude ? parseFloat(String(loc.longitude)) :
        loc.lon ? parseFloat(String(loc.lon)) : null;

    // Set location object if coordinates are valid
    if (latValue !== null && lngValue !== null && !isNaN(latValue) && !isNaN(lngValue)) {
      setSelectedLocationObj({
        name: loc.name || '',
        address: loc.address || '',
        lat: latValue,
        lng: lngValue,
        // alias for payload normalization
        lon: lngValue,
        venueId: loc.venueId || loc.venue_id || '',
        placeId: loc.placeId || loc.places_id || loc.place_id || '',
      });
    }
  };

  const handleConfirm = () => {
    onConfirm({
      venueType,
      location,
      directionalInstructions,
      needsMyGatePass: false, // Always false since we removed the toggle
      gatePassLink: undefined, // Don't send gate pass link from location modal
      showGatePassLink: false, // Don't send show_gate_pass_link from location modal
      selectedLocation: selectedLocationObj,
    });
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 md:p-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[500px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Form Content */}
        {isLoading ? (
          <div className="flex w-full flex-1 items-center justify-center p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : (
          <div className="flex w-full flex-1 flex-col gap-8 overflow-y-auto px-4 pb-4 pt-0">
            {/* Venue Type Section */}
            <div className="flex w-full flex-col gap-3">
              {/* Venue Label */}
              {/* <div className="flex gap-0.5">
              <label className="font-lexend text-sm font-medium leading-5 text-gray-700">
                Venue
              </label>
              <span className="font-lexend text-sm font-medium leading-5 text-brand-600">
                *
              </span>
            </div> */}

              {/* Radio Group */}
              {/* <div className="flex w-full flex-col gap-3">
              <RadioButton
                label="My Residence"
                selected={venueType === 'residence'}
                onClick={() => setVenueType('residence')}
              />
              <RadioButton
                label="A Party Hall"
                selected={venueType === 'hall'}
                onClick={() => setVenueType('hall')}
              />
            </div> */}
            </div>

            {/* Location Search with Autocomplete */}
            <div className="flex w-full flex-col gap-1.5">
              <div className="flex gap-0.5">
                <label className="font-lexend text-sm font-medium leading-5 text-gray-700">
                  Location
                </label>
                <span className="font-lexend text-sm font-medium leading-5 text-brand-600">
                  *
                </span>
              </div>
              <LocationAutocomplete
                value={location}
                onChange={setLocation}
                onLocationSelect={handleLocationSelect}
                placeholder="Search for location..."
                showMapPreview={false}
              />
            </div>

            {/* Show selected location address */}
            {selectedLocationObj && selectedLocationObj.address && (
              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="font-lexend text-sm font-medium text-gray-700 mb-1">
                  Selected Location:
                </p>
                <p className="font-lexend text-sm text-gray-600">
                  {selectedLocationObj.address}
                </p>
              </div>
            )}

            {/* Directional Instructions */}
            <div className="flex w-full flex-col gap-1.5">
              <label className="font-lexend text-sm font-medium leading-5 text-gray-700">
                Direction / Parking Instructions
              </label>
              <TextEditor.Root
                content={directionalInstructions}
                onUpdate={({ editor }) => setDirectionalInstructions(editor.getHTML())}
                placeholder="Enter here"
                inputClassName="min-h-[120px]"
              >
                <TextEditor.Toolbar />
                <TextEditor.Content />
              </TextEditor.Root>
            </div>

          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex w-full shrink-0 gap-4 border-t border-gray-200 bg-white p-4">
          <Button
            color="secondary"
            size="md"
            onClick={onAddLater}
            className="flex-1"
          >
            Add Later
          </Button>
          <Button
            color="primary"
            size="md"
            onClick={handleConfirm}
            className="flex-1"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

