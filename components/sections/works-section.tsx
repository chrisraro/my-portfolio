'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Download, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { projects } from '@/lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function WorksSection() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - (containerRef.current?.clientWidth || 0)

      gsap.to(track, {
        x: () => -(totalWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })
    }, track)

    return () => ctx.revert()
  }, [])

  const scrollBy = (delta: number) => {
    const container = containerRef.current
    if (!container) return
    container.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <section id="works" className="section-padding">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="flex items-center justify-between mb-8">
          <div className="text-center w-full">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">Featured Projects</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">Swipe or use arrows to browse</p>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <button onClick={() => scrollBy(-300)} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full shadow" style={{ background: 'var(--card)' }} aria-label="Previous">
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div ref={containerRef} className="overflow-x-auto scrollbar-hide">
            <div ref={trackRef} className="flex gap-6 min-w-max px-1">
              {projects.map((project, index) => (
                <div key={project.id} className="w-[85vw] sm:w-[60vw] md:w-[420px] shrink-0">
                  <div className="rounded-xl overflow-hidden card-hover h-full" style={{ background: 'var(--card)', boxShadow: 'var(--shadow-lg)' }}>
                    <div className="relative h-48 overflow-hidden">
                      <Image src={project.image} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 85vw, (max-width: 1024px) 60vw, 420px" />
                    </div>
                    <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                      <h3 className="text-xl font-bold mb-2 text-foreground">{project.title}</h3>
                      <p className="text-sm text-primary font-medium mb-2">{project.category}</p>
                      <p className="text-foreground/80 text-sm mb-4 line-clamp-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="px-2 py-1 rounded-full text-xs" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>{tech}</span>
                        ))}
                      </div>
                      <div className="mt-auto flex flex-wrap gap-3">
                        {project.links.live && (
                          <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80">
                            <ExternalLink className="h-4 w-4" /> Live
                          </a>
                        )}
                        {project.links.github && (
                          <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80">
                            <Github className="h-4 w-4" /> Code
                          </a>
                        )}
                        {project.links.appStore && (
                          <a href={project.links.appStore} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80">
                            <Smartphone className="h-4 w-4" /> App Store
                          </a>
                        )}
                        {project.links.playStore && (
                          <a href={project.links.playStore} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80">
                            <Smartphone className="h-4 w-4" /> Play Store
                          </a>
                        )}
                        {project.links.download && (
                          <a href={project.links.download} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80">
                            <Download className="h-4 w-4" /> Download
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => scrollBy(300)} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full shadow" style={{ background: 'var(--card)' }} aria-label="Next">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
