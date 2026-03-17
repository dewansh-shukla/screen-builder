// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/AddressCard.tsx
// Last synced: 2026-03-17T11:05:34.396Z
// API integrations stripped. Use props for data and callbacks.
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';

interface AddressCardProps {
  addressId: string;
  personName: string;
  personNumber: string;
  building: string;
  street: string;
  locality: string;
  city: string;
  state: string;
  zipcode: string;
  landmark?: string;
  isSelected?: boolean;
}

export function AddressCard({
  addressId,
  personName,
  personNumber,
  building,
  street,
  locality,
  city,
  state,
  zipcode,
  landmark,
  isSelected,
}: AddressCardProps) {
  return (
    <Card
      className={`p-4 ${
        isSelected ? 'border-2 border-black bg-white' : 'bg-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <RadioGroupItem
          value={addressId}
          id={addressId}
          className="text-font-black mt-1 border-black"
        />
        <div className="space-y-1">
          <label
            htmlFor={addressId}
            className="text-title-sans-lg font-dm-sans leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {personName} (+{personNumber})
          </label>
          <p className="text-body-md text-black">
            {building}
            {street && <>, {street}</>}
            {locality && <>, {locality}</>}
            <br />
            {city}, {state}, India {zipcode}
            {landmark && <br />}
            {landmark && <>Landmark: {landmark}</>}
          </p>
        </div>
      </div>
    </Card>
  );
}
