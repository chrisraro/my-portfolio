'use client'

import { motion } from 'framer-motion'

export function AboutSection() {
  return (
    <section id="about">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-xl font-bold mb-4"
      >
        About
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="space-y-3 text-muted-foreground leading-relaxed text-base"
      >
        <p>
          I'm Christian Raro, a Software Engineer and Full-Stack Developer based in the Philippines. 
          I specialize in building modern, responsive web applications using React, Next.js, and 
          TypeScript — crafting digital experiences that are both functional and delightful to use.
        </p>
        <p>
          My background spans full-stack development, WordPress solutions, and mobile app development. 
          I'm passionate about writing clean, maintainable code and creating user-centric interfaces 
          with thoughtful design decisions.
        </p>
        <p>
          When I'm not coding, I enjoy exploring new technologies and finding creative ways to solve 
          real-world problems through software.
        </p>
      </motion.div>
    </section>
  )
}
