'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { projects } from '@/lib/data'
import { Project } from '@/types'

const featuredProjects = projects.filter((p: Project) => p.featured)

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

export function WorksSection() {
  return (
    <section id="works" className="py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-6">Recent Projects</h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {featuredProjects.map((project) => {
          const href = project.links.live || project.links.github || '#'
          const displayUrl = project.links.live 
            ? extractDomain(project.links.live) 
            : project.technologies.slice(0, 3).join(' · ')

          return (
            <motion.a
              key={project.id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border rounded-lg p-5 hover:bg-muted/50 transition-colors"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="font-semibold text-foreground text-base">{project.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
              <p className="text-xs text-primary mt-2">{displayUrl}</p>
            </motion.a>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6"
      >
        <Link href="/projects" className="text-sm text-primary font-medium hover:underline">
          View All →
        </Link>
      </motion.div>
    </section>
  )
}
