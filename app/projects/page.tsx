"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { projects } from "@/lib/data"
import { BAND_ORDER } from "@/types"
import { ProjectCard } from "@/components/ui/project-card"
import { staggerContainer, staggerItem } from "@/components/ui/reveal"

export default function ProjectsPage() {
  const [selectedBand, setSelectedBand] = useState<string>("All")

  // Only offer a band that actually has something in it.
  const bands = useMemo(() => {
    const present = BAND_ORDER.filter((band) =>
      projects.some((p) => p.band === band)
    )
    return ["All", ...present]
  }, [])

  const filteredProjects = useMemo(() => {
    if (selectedBand === "All") return projects
    return projects.filter((p) => p.band === selectedBand)
  }, [selectedBand])

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
      <p className="eyebrow mb-2">{'// portfolio'}</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-2">All Projects</h1>
      <p className="text-muted mb-8">Products I own, custom systems, and client work</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {bands.map((band) => (
          <button
            key={band}
            onClick={() => setSelectedBand(band)}
            aria-pressed={selectedBand === band}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedBand === band
                ? "bg-accent text-on-accent"
                : "bg-panel text-ink border border-line hover:bg-panel/80"
            }`}
          >
            {band}
          </button>
        ))}
      </div>

      <motion.div
        key={selectedBand}
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
        <p className="text-center text-muted py-10">
          No projects in this group.
        </p>
      )}
    </div>
  )
}
