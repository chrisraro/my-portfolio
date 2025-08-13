'use client'

import { motion } from 'framer-motion'
import { experience, education } from '@/lib/data'
import { Briefcase, GraduationCap, MapPin } from 'lucide-react'

export function ExperienceSection() {
  return (
    <section id="experience" className="section-padding">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Experience</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">Roles, responsibilities, and achievements</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {experience.map((item, idx) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.1 }} viewport={{ once: true }} className="rounded-xl p-6" style={{ background: 'var(--card)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="flex items-start gap-3 mb-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-foreground/80">{item.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/70 mb-3">
                <span>{item.dates}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{item.location}</span>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                {item.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mt-16 mb-8">
          <h3 className="text-2xl font-bold">Education</h3>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {education.map((e, idx) => (
            <motion.div key={e.school + idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.1 }} viewport={{ once: true }} className="rounded-xl p-6 text-center" style={{ background: 'var(--card)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="flex justify-center mb-3">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground">{e.school}</p>
              <p className="text-sm text-foreground/80 mt-1">{e.degree}</p>
              <p className="text-xs text-foreground/70 mt-1">{e.graduationDate}{e.honors ? ` • ${e.honors}` : ''}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
