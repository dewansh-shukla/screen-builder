// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/product/NewProductCard.tsx
// Last synced: 2026-03-17T11:05:34.436Z
// API integrations stripped. Use props for data and callbacks.
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  href?: string;
  curationVariantId?: string;
  brand?: string;
}

export function NewProductCard({
  id,
  name,
  imageUrl,
  href,
  brand,
  curationVariantId,
}: ProductCardProps) {
  const pathname = usePathname();
  return (
    <Link
      href={
        href ||
        `${pathname}/sample/${id}?curationVariantId=${curationVariantId}`
      }
      className="w-full"
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Card className="h-full w-full overflow-hidden bg-white shadow-xl">
          <CardContent className="flex h-full w-full gap-2 p-4">
            <div className="min-w-1/2">
              <Image
                src={imageUrl}
                alt={name}
                height={152}
                width={152}
                className="h-[152px] w-[152px] rounded-xl object-fill"
              />
            </div>
            <div className="flex w-1/2 flex-col">
              <p className="text-md font-dm-sans text-font-secondary font-extralight">
                {brand}
              </p>
              <p className="text-title-serif-lg font-prata mt-2 text-wrap text-black">
                {name}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
