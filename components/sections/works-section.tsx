'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Download, Smartphone } from 'lucide-react'
import Image from 'next/image'
import { projects } from '@/lib/data'

export function WorksSection() {
  return (
    <section id="works" className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            A showcase of my recent work and technical expertise
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="rounded-xl overflow-hidden card-hover" style={{ background: 'oklch(var(--card))', boxShadow: 'var(--shadow-lg)' }}>
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0" style={{ background: 'oklch(var(--background) / 0)', transition: 'background 300ms' }} />
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{project.title}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{project.category}</p>
                  <p className="text-foreground/80 text-sm mb-4 line-clamp-3">{project.description}</p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 rounded-full text-xs" style={{ background: 'oklch(var(--muted))', color: 'oklch(var(--muted-foreground))' }}>{tech}</span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div className="flex flex-wrap gap-2">
                    {project.links.live && (
                      <motion.a href={project.links.live} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center space-x-1 text-sm text-primary hover:opacity-80 transition-opacity duration-200">
                        <ExternalLink className="h-4 w-4" />
                        <span>Live</span>
                      </motion.a>
                    )}
                    
                    {project.links.github && (
                      <motion.a href={project.links.github} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center space-x-1 text-sm text-primary hover:opacity-80 transition-opacity duration-200">
                        <Github className="h-4 w-4" />
                        <span>Code</span>
                      </motion.a>
                    )}

                    {project.links.appStore && (
                      <motion.a href={project.links.appStore} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center space-x-1 text-sm text-primary hover:opacity-80 transition-opacity duration-200">
                        <Smartphone className="h-4 w-4" />
                        <span>App Store</span>
                      </motion.a>
                    )}

                    {project.links.playStore && (
                      <motion.a href={project.links.playStore} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center space-x-1 text-sm text-primary hover:opacity-80 transition-opacity duration-200">
                        <Smartphone className="h-4 w-4" />
                        <span>Play Store</span>
                      </motion.a>
                    )}

                    {project.links.download && (
                      <motion.a href={project.links.download} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center space-x-1 text-sm text-primary hover:opacity-80 transition-opacity duration-200">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
