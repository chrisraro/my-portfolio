"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { skills } from "@/lib/data"
import { Skill } from "@/types"

const categoryOrder = ["Frontend", "Backend", "Tools & DevOps"] as const

export default function TechStackPage() {
  // Group skills by category
  const skillsByCategory = useMemo(() => {
    return categoryOrder.reduce((acc, category) => {
      acc[category] = skills.filter((skill) => skill.category === category)
      return acc
    }, {} as Record<string, Skill[]>)
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 md:py-28">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-2">Tech Stack</h1>
      <p className="text-muted-foreground mb-10">
        Technologies and tools I work with
      </p>

      {/* Category Sections */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {categoryOrder.map((category) => (
          <CategorySection
            key={category}
            title={category}
            skills={skillsByCategory[category]}
          />
        ))}
      </motion.div>
    </div>
  )
}

function CategorySection({
  title,
  skills,
}: {
  title: string
  skills: Skill[]
}) {
  return (
    <motion.div
      className="mb-10"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <motion.span
            key={skill.id}
            className="bg-muted border border-border rounded-full px-4 py-2 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {skill.name}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}
