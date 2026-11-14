import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { StatusPill } from '@/components/ui/status-pill'
import type { CardItem } from '@/lib/catalog'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  item: CardItem
  /** Larger type and image, for the featured shelf. */
  size?: 'regular' | 'large'
  sizes?: string
  className?: string
}

/**
 * A project as a product: its first screen, its name, who it is for and its
 * status. The whole card is one link to its page. On hover (fine pointer) the
 * card lifts, the image breathes in and a round "view" cue appears.
 */
export function ProductCard({ item, size = 'regular', sizes, className }: ProductCardProps) {
  return (
    <Link href={item.href} className={cn('product card group flex h-full flex-col overflow-hidden', className)}>
      <span className="relative block aspect-[16/10] overflow-hidden bg-gray-fill">
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes={sizes ?? '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw'}
            quality={60}
            className="product__image object-cover object-top"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-gray-text">
            {item.noImage}
          </span>
        )}
        <span
          aria-hidden="true"
          className="product__cue absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-ghost shadow-float"
        >
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </span>
      <span className={cn('flex flex-1 flex-col gap-2', size === 'large' ? 'p-6 sm:p-7' : 'p-5')}>
        <span className="label flex items-center justify-between gap-3">
          <span>{item.sector === 'product' ? item.band : `${item.band} · ${item.sector}`}</span>
          {item.isCaseStudy && <span className="shrink-0">Case study</span>}
        </span>
        <span className={size === 'large' ? 'display-md' : 'font-display text-[1.625rem] leading-[1.05] tracking-[-0.02em]'}>
          {item.title}
        </span>
        <span className="text-[0.9375rem] leading-snug text-gray-text">{item.summary}</span>
        <span className="mt-auto flex items-center justify-between gap-3 pt-3">
          <StatusPill status={item.status} label={item.statusLabel} />
          <span aria-hidden="true" className="truncate text-xs text-gray-text">
            {item.domain}
          </span>
        </span>
      </span>
    </Link>
  )
}
