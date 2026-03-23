'use client'

import { motion } from 'framer-motion'
import { Code2, GraduationCap } from 'lucide-react'

const credentials = [
  {
    title: 'Software Engineer',
    subtitle: 'Full-stack Development',
    description: 'Building modern web applications with React, Next.js, and TypeScript',
    highlight: true,
    icon: Code2,
  },
  {
    title: 'B.S. Computer Science',
    subtitle: 'Bicol University',
    description: 'Graduate with focus on software engineering and web technologies',
    highlight: false,
    icon: GraduationCap,
  },
]

export function CredentialsSidebar() {
  return (
    <div className="flex flex-col gap-4">
      {credentials.map((credential, index) => (
        <motion.div
          key={credential.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className={`rounded-xl p-5 ${
            credential.highlight
              ? 'bg-zinc-900 dark:bg-zinc-800 text-white'
              : 'bg-muted border border-border'
          }`}
        >
          <div className="flex items-start gap-3">
            <credential.icon className={`w-5 h-5 flex-shrink-0 ${credential.highlight ? 'text-primary' : 'text-primary'}`} />
            <div className="flex-1">
              <div className={`text-xs uppercase tracking-wider mb-1 ${
                credential.highlight ? 'text-zinc-400' : 'text-muted-foreground'
              }`}>
                {credential.subtitle}
              </div>
              <div className={`font-bold text-lg mb-2 ${
                credential.highlight ? 'text-white' : 'text-foreground'
              }`}>
                {credential.title}
              </div>
              <div className={`text-sm ${
                credential.highlight ? 'text-zinc-300' : 'text-muted-foreground'
              }`}>
                {credential.description}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
