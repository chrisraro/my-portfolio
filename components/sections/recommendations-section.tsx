"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { recommendations } from "@/lib/data"
import { Recommendation } from "@/types"

export default function RecommendationsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  // Auto-advance every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % recommendations.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [activeIndex])

  const currentRecommendation: Recommendation = recommendations[activeIndex]

  return (
    <section
      id="recommendations"
      className="py-8 md:py-12 text-center"
    >
      <h2 className="text-xl font-bold mb-6 text-foreground">
        Recommendations
      </h2>

      <div className="min-h-[150px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRecommendation.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-lg md:text-xl text-foreground leading-relaxed italic">
              &ldquo;{currentRecommendation.quote}&rdquo;
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              — {currentRecommendation.authorName}, {currentRecommendation.authorTitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Navigation */}
      <div className="flex gap-2 justify-center mt-6">
        {recommendations.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to recommendation ${index + 1}`}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeIndex ? "bg-primary" : "bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
