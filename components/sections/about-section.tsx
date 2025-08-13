'use client'

import { motion } from 'framer-motion'
import { Download, MapPin } from 'lucide-react'
import Image from 'next/image'

export function AboutSection() {
  return (
    <section id="about" className="section-padding" style={{ background: 'var(--muted)' }}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="relative">
            <div className="glow-border">
              <div className="glow-inner p-6 rounded-2xl shadow-xl">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                  <Image src="/assets/images/about/christian-noBG.png" alt="Christian Raro - Software Engineer" fill className="object-cover" priority />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-6">
            <div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold font-display mb-6">
                About Me
              </motion.h2>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} viewport={{ once: true }} className="space-y-4 text-lg text-foreground/80">
              <p>
                I'm a passionate <strong>Software Engineer</strong> and recent Computer Science graduate 
                from Bicol University, dedicated to creating innovative digital solutions.
              </p>
              <p>
                With expertise in modern web technologies and mobile development, I specialize in designing, developing, and delivering software that solves real-world challenges and enhances user experiences across digital platforms.
              </p>
              <div className="flex items-center space-x-2 text-foreground/70">
                <MapPin className="h-5 w-5" />
                <span className="text-sm">Based in Naga City, Camarines Sur, Bicol, Philippines</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} viewport={{ once: true }} className="pt-4">
              <motion.a href="/assets/resume/Raro, Christian F - Resume.pdf" download whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center space-x-2 button-primary">
                <Download className="h-5 w-5" />
                <span>Download Resume</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
