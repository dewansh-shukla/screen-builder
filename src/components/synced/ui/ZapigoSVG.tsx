// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/ui/ZapigoSVG.tsx
// Last synced: 2026-03-17T11:05:34.437Z
// API integrations stripped. Use props for data and callbacks.
import Image from 'next/image';

interface ZapigoSVGProps {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
}

const ZapigoSVG = ({
  width = 80,
  height,
  className = '',
  onClick,
}: ZapigoSVGProps) => {
  // Calculate aspect ratio based on the new logo (714:150)
  const aspectRatio = 714 / 150;
  const calculatedHeight = width / aspectRatio;
  const finalHeight = height ?? calculatedHeight;

  const imageElement = (
    <Image
      src="/assets/images/zapigo_logo_updated.svg"
      alt="Zapigo Logo"
      width={width}
      height={finalHeight}
      className={onClick ? undefined : className}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      priority
    />
  );

  if (onClick) {
    return (
      <div 
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
        className={className} 
        style={{ cursor: 'pointer', display: 'inline-block', lineHeight: 0 }}
      >
        {imageElement}
      </div>
    );
  }

  return imageElement;
};

export default ZapigoSVG;
export type { ZapigoSVGProps };
