'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { skills } from '@/lib/data'
import { Skill } from '@/types'

const categories = ['Frontend', 'Backend', 'Tools & DevOps'] as const

export function SkillsSection() {
  const getSkillsByCategory = (category: Skill['category']) =>
    skills.filter((s) => s.category === category)

  return (
    <section id="skills">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xl font-bold mb-6">Tech Stack</h2>

        {categories.map((category) => (
          <div key={category} className="mb-5">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {getSkillsByCategory(category).map((skill) => (
                <span
                  key={skill.id}
                  className="bg-muted border border-border rounded-full px-3 py-1.5 text-sm font-medium text-foreground"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}

        <Link
          href="/tech-stack"
          className="text-sm text-primary font-medium hover:underline"
        >
          View All →
        </Link>
      </motion.div>
    </section>
  )
}
