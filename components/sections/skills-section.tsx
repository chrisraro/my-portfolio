'use client'

import { motion } from 'framer-motion'
import { skills } from '@/lib/data'
import { FaHtml5, FaCss3Alt, FaJsSquare, FaPhp, FaJava, FaGitAlt, FaWordpress } from 'react-icons/fa'
import { SiBubble } from 'react-icons/si'

const iconMap: Record<string, { Icon?: React.ComponentType<{ className?: string }>; color: string }> = {
  html5: { Icon: FaHtml5, color: '#E34F26' },
  css3: { Icon: FaCss3Alt, color: '#1572B6' },
  javascript: { Icon: FaJsSquare, color: '#F7DF1E' },
  php: { Icon: FaPhp, color: '#777BB4' },
  java: { Icon: FaJava, color: '#007396' },
  git: { Icon: FaGitAlt, color: '#F05032' },
  wordpress: { Icon: FaWordpress, color: '#21759B' },
  bubble: { Icon: SiBubble, color: '#1F70FF' },
}

export function SkillsSection() {
  return (
    <section id="skills" className="section-padding" style={{ background: 'var(--muted)' }}>
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Skills & Technologies</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">Technologies and tools I work with</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => {
            const entry = iconMap[skill.icon]
            const IconComponent = entry?.Icon
            return (
              <motion.div key={skill.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.1 }} viewport={{ once: true }} whileHover={{ scale: 1.05, y: -5 }} className="group">
                <div className="rounded-xl p-6 text-center card-hover" style={{ background: 'var(--card)', boxShadow: 'var(--shadow-lg)' }}>
                  <div className="mb-4 flex justify-center">
                    {IconComponent ? (
                      <IconComponent className="h-10 w-10" style={{ color: entry?.color }} aria-label={skill.name} />
                    ) : (
                      <span className="text-3xl" aria-hidden>💻</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">{skill.name}</h3>
                  <p className="text-xs text-foreground/70 mt-1 capitalize">{skill.category}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} viewport={{ once: true }} className="text-center mt-16">
          <p className="text-foreground/70 max-w-2xl mx-auto">I'm constantly learning and exploring new technologies to stay up-to-date with the latest industry trends and best practices.</p>
        </motion.div>
      </div>
    </section>
  )
}
