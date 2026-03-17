// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/GifterCard.tsx
// Last synced: 2026-03-17T11:05:34.409Z
// API integrations stripped. Use props for data and callbacks.
import Image from 'next/image';
import { GiftCardTemplate } from '@/types/cards';
import { motion } from 'framer-motion';
interface CardProps {
  template: GiftCardTemplate;
  onClick: () => void;
}

export default function GifterCard({ template, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-40 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
    >
      <div className="flex w-full items-center justify-center bg-gray-200">
        {template.design?.asset1?.uploadedAssetUrl && (
          <Image
            src={`${
              template.design?.asset1?.uploadedAssetUrl.startsWith('http')
                ? ''
                : 'https://'
            }${template.design?.asset1?.uploadedAssetUrl}`}
            alt={template.design?.caption}
            width={200}
            height={280}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {/* <div className="p-3">
        <h3 className="text-lg font-semibold text-gray-800 text-center">
          {template.design?.caption}
        </h3>
      </div> */}
    </motion.div>
  );
}
