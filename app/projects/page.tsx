"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { projects } from "@/lib/data"
import { ProjectCard } from "@/components/ui/project-card"
import { staggerContainer, staggerItem } from "@/components/ui/reveal"

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(projects.map((p) => p.category)))
    return ["All", ...uniqueCategories]
  }, [])

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects
    return projects.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
      <p className="eyebrow mb-2">// portfolio</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-2">All Projects</h1>
      <p className="text-muted-foreground mb-8">A collection of projects I&apos;ve worked on</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground border border-border hover:bg-muted/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div
        key={selectedCategory}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {filteredProjects.map((project) => (
          <motion.div key={project.id} variants={staggerItem}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No projects found in this category.
        </p>
      )}
    </div>
  )
}
