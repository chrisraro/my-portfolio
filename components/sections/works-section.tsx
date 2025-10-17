'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Download, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { projects } from '@/lib/data'
import { DotButton } from '@/components/ui/dot-button'

export function WorksSection() {
  const [isMounted, setIsMounted] = useState(false)
  
  // Memoize autoplay configuration for better performance
  const autoplayConfig = useMemo(() => Autoplay({ 
    delay: 5000, 
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    stopOnFocusIn: true,
    rootNode: (emblaRoot) => emblaRoot.parentElement
  }), [])

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    dragFree: false,
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 1 },
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  }, [autoplayConfig])
  
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  // Ensure component only renders on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!emblaApi) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          emblaApi.scrollPrev()
          break
        case 'ArrowRight':
          event.preventDefault()
          emblaApi.scrollNext()
          break
        case 'Home':
          event.preventDefault()
          emblaApi.scrollTo(0)
          break
        case 'End':
          event.preventDefault()
          emblaApi.scrollTo(scrollSnaps.length - 1)
          break
      }
    }

    if (isMounted) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [emblaApi, isMounted, scrollSnaps.length])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi || !isMounted) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect, isMounted])

  // Memoize project cards to prevent unnecessary re-renders
  const projectCards = useMemo(() => projects.map((project, index) => (
    <motion.div 
      key={project.id} 
      className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${projects.length}`}
    >
      <motion.div 
        className="group h-full"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <article className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border border-slate-200 dark:border-slate-700">
          {/* Enhanced Image Container - Fixed to show full image */}
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image 
              src={project.image} 
              alt={`${project.title} - ${project.description}`}
              fill 
              className="object-contain bg-slate-50 dark:bg-slate-700 transition-transform duration-700 group-hover:scale-105" 
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 3} // Prioritize first 3 images
              loading={index < 3 ? "eager" : "lazy"}
            />
            {/* Subtle overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Action buttons overlay */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {project.links.live && (
                <motion.a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`View ${project.title} live site (opens in new tab)`}
                >
                  <ExternalLink className="h-4 w-4 text-primary" />
                </motion.a>
              )}
              {project.links.github && (
                <motion.a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`View ${project.title} source code (opens in new tab)`}
                >
                  <Github className="h-4 w-4 text-primary" />
                </motion.a>
              )}
            </div>
          </div>

          {/* Enhanced Content Area */}
          <div className="p-6 space-y-4 h-[calc(100%-12rem)] flex flex-col">
            {/* Header */}
            <header className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {project.title}
                </h3>
                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                  {project.category}
                </span>
              </div>
            </header>

            {/* Description */}
            <p className="text-foreground/70 text-sm line-clamp-3 leading-relaxed flex-1">
              {project.description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used">
              {project.technologies.slice(0, 4).map((tech) => (
                <span 
                  key={tech} 
                  className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-600 transition-colors"
                  role="listitem"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span 
                  className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-600"
                  role="listitem"
                  aria-label={`and ${project.technologies.length - 4} more technologies`}
                >
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>

            {/* Enhanced Action Links */}
            <nav className="flex flex-wrap gap-3 pt-2 border-t border-slate-200 dark:border-slate-700" aria-label="Project links">
              {project.links.live && (
                <motion.a 
                  href={project.links.live} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  aria-label={`View ${project.title} live demo (opens in new tab)`}
                >
                  <ExternalLink className="h-4 w-4" /> 
                  <span>Live Demo</span>
                </motion.a>
              )}
              {project.links.github && (
                <motion.a 
                  href={project.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  aria-label={`View ${project.title} source code (opens in new tab)`}
                >
                  <Github className="h-4 w-4" /> 
                  <span>Source</span>
                </motion.a>
              )}
              {(project.links.appStore || project.links.playStore) && (
                <motion.a 
                  href={project.links.appStore || project.links.playStore} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  aria-label={`Download ${project.title} app (opens in new tab)`}
                >
                  <Smartphone className="h-4 w-4" /> 
                  <span>Download</span>
                </motion.a>
              )}
            </nav>
          </div>
        </article>
      </motion.div>
    </motion.div>
  )), [])

  // Show loading state until mounted
  if (!isMounted) {
    return (
      <section id="works" className="section-padding bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Discover my latest work and creative solutions
            </p>
          </div>

          {/* Static fallback grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="group">
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image 
                      src={project.image} 
                      alt={project.title} 
                      fill 
                      className="object-contain bg-slate-50 dark:bg-slate-700 transition-transform duration-700 group-hover:scale-105" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-foreground/70 text-sm line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section 
      id="works" 
      className="section-padding bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      aria-label="Featured projects carousel"
    >
      <div className="container-custom">
        {/* Enhanced Header with Original Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }} 
          className="flex items-center justify-between mb-8"
        >
          <div className="text-center w-full">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">Featured Projects</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">Swipe or use arrows to browse</p>
          </div>
        </motion.div>

        {/* Enhanced Carousel */}
        <div className="relative" role="region" aria-label="Featured projects carousel">
          {/* Navigation Buttons with Enhanced Styling */}
          <motion.button 
            onClick={scrollPrev}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 bg-white dark:bg-slate-800 backdrop-blur-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
            aria-label="Go to previous project"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </motion.button>

          <motion.button 
            onClick={scrollNext}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 bg-white dark:bg-slate-800 backdrop-blur-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
            aria-label="Go to next project"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </motion.button>

          {/* Enhanced Carousel Container */}
          <div 
            className="embla overflow-hidden rounded-3xl" 
            ref={emblaRef}
            role="group"
            aria-label={`Project ${selectedIndex + 1} of ${scrollSnaps.length}`}
          >
            <div className="embla__container flex">
              <AnimatePresence mode="wait">
                {projectCards}
              </AnimatePresence>
            </div>
          </div>

          {/* Enhanced Dot Indicators */}
          <div 
            className="flex justify-center mt-12 gap-3" 
            role="tablist"
            aria-label="Carousel navigation dots"
          >
            {scrollSnaps.map((_, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <DotButton
                  selected={index === selectedIndex}
                  onClick={() => scrollTo(index)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .embla {
          --slide-spacing: 1.5rem;
          --slide-size: 100%;
          --slide-height: 19rem;
        }
        .embla__viewport {
          overflow: hidden;
          border-radius: 1.5rem;
        }
        .embla__container {
          backface-visibility: hidden;
          display: flex;
          touch-action: pan-y;
          margin-left: calc(var(--slide-spacing) * -1);
        }
        .embla__slide {
          flex: 0 0 var(--slide-size);
          min-width: 0;
          padding-left: var(--slide-spacing);
        }
        @media (min-width: 640px) {
          .embla {
            --slide-size: 50%;
          }
        }
        @media (min-width: 1024px) {
          .embla {
            --slide-size: 33.333%;
          }
        }
        
        /* Enhanced shadow styles */
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* Smooth scrollbar */
        .embla::-webkit-scrollbar {
          display: none;
        }
        .embla {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Performance optimizations */
        .embla__slide {
          will-change: transform;
        }
        
        /* GPU acceleration for smooth animations */
        .embla__container {
          transform: translateZ(0);
        }
        
        /* Focus styles for better accessibility */
        *:focus {
          outline: none;
        }
        
        *:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
      `}</style>
    </section>
  )
}