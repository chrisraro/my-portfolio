'use client'

import { motion } from 'framer-motion'
import { buildTimeline } from '@/lib/timeline'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
}

export function ExperienceSection() {
  const timeline = buildTimeline()

  return (
    <section id="experience">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-xl font-bold tracking-tight mb-6"
      >
        Experience
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative border-l-2 border-border pl-4 sm:pl-6"
      >
        {timeline.map((entry, idx) => (
          <motion.div
            key={`${entry.type}-${idx}`}
            variants={itemVariants}
            className="relative pb-5 last:pb-0"
          >
            {/* Marker */}
            <span
              className={`absolute -left-[23px] sm:-left-[31px] top-1.5 sm:top-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                entry.type === 'work'
                  ? 'bg-primary'
                  : 'border-2 border-muted-foreground bg-background'
              }`}
            />

            {/* Content */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5 sm:gap-4">
              <div className="min-w-0">
                <span className="font-medium text-foreground text-sm sm:text-base leading-snug block">
                  {entry.title}
                </span>
                {entry.subtitle && (
                  <span className="text-muted-foreground text-xs sm:text-sm block">
                    {entry.subtitle}
                  </span>
                )}
                {entry.note && (
                  <span className="text-muted-foreground text-xs block italic">
                    {entry.note}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground sm:whitespace-nowrap sm:shrink-0 mt-0.5 sm:mt-0">
                {entry.date}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
