'use client'

import { motion } from 'framer-motion'
import { skills } from '@/lib/data'

const skillIcons: Record<string, string> = {
  html5: '🔷', css3: '🔶', javascript: '🟡', php: '🟣', java: '🟠', git: '🔴', wordpress: '🔵', bubble: '🟢',
}

export function SkillsSection() {
  return (
    <section id="skills" className="section-padding" style={{ background: 'oklch(var(--muted))' }}>
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Skills & Technologies</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">Technologies and tools I work with</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div key={skill.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.1 }} viewport={{ once: true }} whileHover={{ scale: 1.05, y: -5 }} className="group">
              <div className="rounded-xl p-6 text-center card-hover" style={{ background: 'oklch(var(--card))', boxShadow: 'var(--shadow-lg)' }}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{skillIcons[skill.icon] || '💻'}</div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">{skill.name}</h3>
                <p className="text-xs text-foreground/70 mt-1 capitalize">{skill.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} viewport={{ once: true }} className="text-center mt-16">
          <p className="text-foreground/70 max-w-2xl mx-auto">I'm constantly learning and exploring new technologies to stay up-to-date with the latest industry trends and best practices.</p>
        </motion.div>
      </div>
    </section>
  )
}
