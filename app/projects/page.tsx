"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { projects } from "@/lib/data"
import { Project } from "@/types"

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  // Extract unique categories from projects
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(projects.map((p) => p.category)))
    return ["All", ...uniqueCategories]
  }, [])

  // Filter projects based on selected category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects
    return projects.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 md:py-28">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-2">All Projects</h1>
      <p className="text-muted-foreground mb-8">
        A collection of projects I&apos;ve worked on
      </p>

      {/* Category Filter */}
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

      {/* Project Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No projects found in this category.
        </p>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const primaryLink = project.links.live || project.links.github || "#"

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <Link
        href={primaryLink}
        target={primaryLink !== "#" ? "_blank" : undefined}
        rel={primaryLink !== "#" ? "noopener noreferrer" : undefined}
        className="block border border-border rounded-lg p-5 hover:bg-muted/50 transition-colors h-full"
      >
        {/* Project Title */}
        <h3 className="font-semibold text-base">{project.title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1 mt-3">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="bg-muted rounded px-2 py-0.5 text-xs"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 mt-2">
          {project.links.live && (
            <span className="inline-flex items-center gap-1 text-xs text-primary">
              <ExternalLink className="w-3 h-3" />
              Live Site
            </span>
          )}
          {project.links.github && (
            <span className="inline-flex items-center gap-1 text-xs text-primary">
              <Github className="w-3 h-3" />
              GitHub
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
