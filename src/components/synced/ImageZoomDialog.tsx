// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/ImageZoomDialog.tsx
// Last synced: 2026-03-17T11:05:34.413Z
// API integrations stripped. Use props for data and callbacks.
import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';

interface ImageZoomDialogProps {
  src: string;
  alt: string;
  bgColor?: string;
}

export function ImageZoomDialog({
  src,
  alt,
  bgColor = 'white',
}: ImageZoomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));

  const handleWheel = (event: React.WheelEvent) => {
    if (event.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      const newX = event.clientX - startPosition.x;
      const newY = event.clientY - startPosition.y;
      setPosition({
        x: Math.min(Math.max(newX, -((scale - 1) * 50)), (scale - 1) * 50),
        y: Math.min(Math.max(newY, -((scale - 1) * 50)), (scale - 1) * 50),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      setIsDragging(true);
      setStartPosition({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });

      // Set up hold timer for mobile
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500); // 500ms hold
      setHoldTimer(timer);
    }
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    // Clear hold timer if user moves finger
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }

    if (isDragging && event.touches.length === 1) {
      const touch = event.touches[0];
      const newX = touch.clientX - startPosition.x;
      const newY = touch.clientY - startPosition.y;
      setPosition({
        x: Math.min(Math.max(newX, -((scale - 1) * 50)), (scale - 1) * 50),
        y: Math.min(Math.max(newY, -((scale - 1) * 50)), (scale - 1) * 50),
      });
    }
  };

  const handleTouchEnd = () => {
    // Clear hold timer
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
    setIsDragging(false);
  };

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleImageMouseDown = () => {
    // Set up hold timer for desktop
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // 500ms hold
    setHoldTimer(timer);
  };

  const handleImageMouseUp = () => {
    // Clear hold timer
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  const handleImageMouseLeave = () => {
    // Clear hold timer if mouse leaves
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  return (
    <>
      <div
        className="relative h-full w-full cursor-pointer"
        onClick={handleClick}
        onMouseDown={handleImageMouseDown}
        onMouseUp={handleImageMouseUp}
        onMouseLeave={handleImageMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={src || '/placeholder.svg'}
          alt={alt}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] max-w-[90vw] rounded-2xl border-0 p-0">
          <DialogTitle className="hidden" />
          <div
            className={`relative h-full min-h-[50vh] w-full bg-${bgColor}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={src || '/placeholder.svg'}
              alt={alt}
              fill
              className={cn(
                'object-contain transition-transform duration-200',
                scale > 1 && 'cursor-move',
              )}
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              }}
            />
          </div>
          <div className="absolute right-4 bottom-4 flex gap-2">
            <button
              onClick={handleZoomOut}
              className="h-10 w-10 rounded-full bg-white p-2 text-black shadow"
              disabled={scale === 1}
            >
              -
            </button>
            <button
              onClick={handleZoomIn}
              className="h-10 w-10 rounded-full bg-white p-2 text-black shadow"
              disabled={scale === 3}
            >
              +
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
