'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

/**
 * Fade/slide-in entrance, animated on mount.
 *
 * Two deliberate choices:
 * 1. Animate on mount (not `whileInView`): framer-motion's in-view trigger only
 *    fires on an enter transition, so content already in the viewport on first
 *    paint would stay stuck at opacity 0.
 * 2. Always render the same `motion.div` — never branch the element type on
 *    reduced motion. A conditional `<div>` vs `<motion.div>` causes a hydration
 *    mismatch that leaves the SSR `opacity: 0` inline style stuck. For reduced
 *    motion we just collapse the movement and make the transition instant.
 */
export function Reveal({ children, delay = 0, y = 20, className }: RevealProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

/** Stagger container variants for grids/lists. Use with `staggerItem`. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}
