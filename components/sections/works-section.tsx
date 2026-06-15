'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { projects } from '@/lib/data'
import { Project } from '@/types'
import { ProjectCard } from '@/components/ui/project-card'
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/reveal'

const featuredProjects = projects.filter((p: Project) => p.featured)

export function WorksSection() {
  return (
    <section id="works" className="py-8 md:py-12">
      <Reveal>
        <p className="eyebrow mb-2">// selected work</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight mb-6">Recent Projects</h2>
      </Reveal>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {featuredProjects.map((project) => (
          <motion.div key={project.id} variants={staggerItem}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>

      <Reveal delay={0.2} className="mt-6">
        <Link href="/projects" className="text-sm text-primary font-medium hover:underline">
          View All →
        </Link>
      </Reveal>
    </section>
  )
}
