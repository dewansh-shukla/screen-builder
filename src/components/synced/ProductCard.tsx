// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/ProductCard.tsx
// Last synced: 2026-03-17T11:05:34.420Z
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
}

export function ProductCard({
  id,
  name,
  imageUrl,
  href,
  curationVariantId,
}: ProductCardProps) {
  const pathname = usePathname();
  return (
    <Link
      href={
        href ||
        `${pathname}/sample/${id}?curationVariantId=${curationVariantId}`
      }
      className="min-h-[250px] w-[calc(50%-0.5rem)]"
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Card className="h-full w-full overflow-hidden shadow-xl">
          <CardContent className="h-full w-full p-0">
            <div className="relative w-full">
              <Image
                src={imageUrl}
                alt={name}
                height={226}
                width={226}
                className="h-[226px] w-full object-fill"
              />
            </div>
            <div className="p-4">
              <h3 className="text-font-primary line-clamp-2 font-serif text-lg">
                {name}
              </h3>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
