'use client'

import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { ProductCard } from '@/components/ui/product-card'
import type { CardItem } from '@/lib/catalog'
import { cn } from '@/lib/utils'
import type { ProjectBand } from '@/types'

type Filter = ProjectBand | 'All'

interface CatalogueProps {
  items: CardItem[]
  /** The bands offered as segments, in order. */
  bands: ProjectBand[]
  initial?: ProjectBand | null
  /** Names the control for assistive tech, e.g. "Filter client work". */
  label: string
  /** Show only this many until "Show all" is pressed; omit to show everything. */
  preview?: number
}

const SPRING = { type: 'spring', stiffness: 420, damping: 36 } as const

/**
 * The catalogue: an iOS segmented control over a grid of products. Choosing a
 * segment slides the thumb, and the cards that stay glide to their new places
 * while the others fade. Without JavaScript the whole grid is simply shown.
 */
export function Catalogue({ items, bands, initial = null, label, preview }: CatalogueProps) {
  const [filter, setFilter] = useState<Filter>(initial ?? 'All')
  const [expanded, setExpanded] = useState(false)
  const reduce = useReducedMotion()
  const segments: Filter[] = ['All', ...bands]
  const matching = filter === 'All' ? items : items.filter((item) => item.band === filter)
  const shown = preview && !expanded ? matching.slice(0, preview) : matching
  const count = (segment: Filter) => (segment === 'All' ? items.length : items.filter((i) => i.band === segment).length)

  return (
    <LayoutGroup>
      <div className="-mx-5 mb-8 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <div role="group" aria-label={label} className="inline-flex rounded-full bg-gray-fill p-1">
          {segments.map((segment) => {
            const active = segment === filter
            return (
              <button
                key={segment}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(segment)}
                className={cn(
                  'relative min-h-[40px] whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors',
                  active ? 'text-ink' : 'text-gray-text hover:text-ink',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="segment-thumb"
                    transition={reduce ? { duration: 0 } : SPRING}
                    className="absolute inset-0 rounded-full bg-snow shadow-card"
                  />
                )}
                <span className="relative">
                  {segment} <span className="tabular-nums text-gray-text">{count(segment)}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((item) => (
            <motion.li
              key={item.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={reduce ? { duration: 0 } : SPRING}
            >
              <ProductCard item={item} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {shown.length < matching.length && (
        <p className="mt-8 text-center">
          <button type="button" onClick={() => setExpanded(true)} className="btn btn-secondary">
            Show all {matching.length}
          </button>
        </p>
      )}
      <p aria-live="polite" className="sr-only">
        {shown.length} of {items.length} projects shown
      </p>
    </LayoutGroup>
  )
}
