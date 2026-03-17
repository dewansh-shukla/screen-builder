'use client';

interface PriceDisplayProps {
  offerPrice?: number;
  lastPrice?: number;
  firstVariantPrice?: number;
  size?: 'sm' | 'md';
}

export function PriceDisplay({
  offerPrice,
  lastPrice,
  firstVariantPrice,
  size = 'md',
}: PriceDisplayProps) {
  // Get prices from props only - no API calls
  // Use offerPrice/lastPrice if available, otherwise fallback to firstVariantPrice, otherwise 0
  let offer: number;
  let last: number;

  if (offerPrice !== undefined || lastPrice !== undefined) {
    // Use prices from list response
    offer = offerPrice !== undefined && offerPrice !== null ? Number(offerPrice) : 0;
    last = lastPrice !== undefined && lastPrice !== null ? Number(lastPrice) : 0;
    
    // If one is missing, use firstVariantPrice as fallback
    if (offer === 0 && firstVariantPrice !== undefined && firstVariantPrice !== null && firstVariantPrice > 0) {
      offer = Number(firstVariantPrice);
    }
    if (last === 0 && firstVariantPrice !== undefined && firstVariantPrice !== null && firstVariantPrice > 0) {
      last = Number(firstVariantPrice);
    }
  } else {
    // No pricing data - use firstVariantPrice if available, otherwise 0
    if (firstVariantPrice !== undefined && firstVariantPrice !== null && firstVariantPrice > 0) {
      offer = Number(firstVariantPrice);
      last = Number(firstVariantPrice);
    } else {
      offer = 0;
      last = 0;
    }
  }

  // Logic:
  // 1. If offer > 0 and offer < last: show offer as main, last with strikethrough
  // 1b. If offer > 0 and offer > last: show offer as main, last with strikethrough (price increased)
  // 2. If offer == last: show last (no strikethrough)
  // 3. If offer is 0/not given: show last (no strikethrough)
  // 4. If both are 0: show 0

  let effective: number;
  let showStrike: boolean;

  if (offer > 0 && offer < last) {
    // Case 1: offer exists and is less than last - show offer as main, last with strike
    effective = offer;
    showStrike = true;
  } else if (offer > 0 && offer > last) {
    // Case 1b: offer is greater than last - show last as main, offer with strike (show lower price as main)
    effective = last;
    showStrike = true;
  } else if (offer > 0 && offer === last) {
    // Case 2: both are same - show last (no strikethrough)
    effective = last;
    showStrike = false;
  } else if (offer === 0 || offer === null || offer === undefined) {
    // Case 3: offer not given - show last (no strikethrough)
    effective = last;
    showStrike = false;
  } else {
    // Case 4: both are 0 or fallback
    effective = last;
    showStrike = false;
  }

  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const strikeSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <div className="mt-1 flex items-center gap-2">
      <p className={`font-lexend ${textSize} font-medium text-brand-600`}>
        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(effective)}
      </p>
      {showStrike && offer > 0 && offer < last && (
        <p className={`${strikeSize} text-gray-500 line-through`}>
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(last)}
        </p>
      )}
      {showStrike && offer > 0 && offer > last && (
        <p className={`${strikeSize} text-gray-500 line-through`}>
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(offer)}
        </p>
      )}
    </div>
  );
}

