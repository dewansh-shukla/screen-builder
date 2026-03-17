// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/ImageOrVideoDialog.tsx
// Last synced: 2026-03-17T11:05:34.413Z
// API integrations stripped. Use props for data and callbacks.
import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';

interface SimpleDialogProps {
  src: string;
  alt: string;
  isVideo?: boolean;
}

export function SimpleDialog({ src, alt, isVideo = false }: SimpleDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {isVideo ? (
          <video src={src} alt={alt} className="object-contain p-6" controls />
        ) : (
          <Image
            src={src || '/placeholder.svg'}
            alt={alt}
            fill
            className="object-contain p-6"
          />
        )}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] max-w-[90vw] p-0">
          <DialogTitle className="hidden" />
          <div className="relative h-full min-h-[50vh] w-full">
            {isVideo ? (
              <video
                src={src}
                alt={alt}
                className="h-full w-full object-contain"
                controls
              />
            ) : (
              <Image
                src={src || '/placeholder.svg'}
                alt={alt}
                fill
                className="object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
