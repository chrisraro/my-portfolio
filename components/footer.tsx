'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Facebook, Mail } from 'lucide-react'
import { socialLinks } from '@/lib/data'

const socialIcons = { github: Github, linkedin: Linkedin, facebook: Facebook, mail: Mail }

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12" style={{ background: 'oklch(var(--foreground))' }}>
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center md:text-left">
            <div className="text-2xl font-bold font-display gradient-text mb-4">Christian Raro</div>
            <p className="text-background/80 text-sm">Software Engineer & Frontend Developer crafting innovative digital experiences.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="text-center">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--background))' }}>Quick Links</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <a href="#about" className="transition-colors duration-200" style={{ color: 'oklch(var(--background) / 0.7)' }}>About</a>
              <a href="#works" className="transition-colors duration-200" style={{ color: 'oklch(var(--background) / 0.7)' }}>Projects</a>
              <a href="#skills" className="transition-colors duration-200" style={{ color: 'oklch(var(--background) / 0.7)' }}>Skills</a>
              <a href="#contact" className="transition-colors duration-200" style={{ color: 'oklch(var(--background) / 0.7)' }}>Contact</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }} className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--background))' }}>Connect</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.icon as keyof typeof socialIcons]
                if (!Icon) return null
                return (
                  <motion.a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-full transition-colors duration-200 group" style={{ background: 'oklch(var(--background))' }} aria-label={social.name}>
                    <Icon className="h-5 w-5 text-foreground group-hover:text-primary transition-colors duration-200" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} viewport={{ once: true }} className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid oklch(var(--border))' }}>
          <p className="text-background/80 text-sm">© {currentYear} Christian Raro. All rights reserved.</p>
          <p className="text-background/70 text-xs mt-2">Built with Next.js, React, and Tailwind CSS</p>
        </motion.div>
      </div>
    </footer>
  )
}
