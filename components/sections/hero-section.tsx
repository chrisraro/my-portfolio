'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Github, Linkedin, Mail, Facebook } from 'lucide-react'
import { socialLinks } from '@/lib/data'

const socialIcons = { github: Github, linkedin: Linkedin, mail: Mail, facebook: Facebook }

export function HeroSection() {
  const scrollToWorks = () => {
    const element = document.querySelector('#works')
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-24 h-24 rounded-full animate-float" style={{ background: 'color-mix(in oklch, var(--primary) 10%, transparent)' }} />
        <div className="absolute top-60 right-20 w-32 h-32 rounded-full animate-float" style={{ background: 'color-mix(in oklch, var(--accent) 10%, transparent)', animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-20 w-20 h-20 rounded-full animate-float" style={{ background: 'color-mix(in oklch, var(--ring) 10%, transparent)', animationDelay: '4s' }} />
      </div>

      <div className="container-custom text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-4xl md:text-6xl lg:text-7xl font-bold font-display">
            Hello, I'm <span className="gradient-text">Christian</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto">
            A passionate <strong>Software Engineer</strong> and <strong>Frontend Developer</strong> crafting innovative digital experiences
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Specializing in web applications, mobile development, and scalable solutions that deliver exceptional user experiences.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex justify-center space-x-4 pt-8">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.icon as keyof typeof socialIcons]
              if (!Icon) return null
              return (
                <motion.a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} className="p-3 rounded-full transition-colors duration-200 group" style={{ background: 'var(--muted)' }} aria-label={social.name}>
                  <Icon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors duration-200" />
                </motion.a>
              )
            })}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="pt-12 flex justify-center">
            <motion.button onClick={scrollToWorks} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex flex-col items-center space-y-2 text-foreground/70 hover:text-primary transition-colors duration-200">
              <span className="text-sm font-medium">Explore My Work</span>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <ChevronDown className="h-6 w-6" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
