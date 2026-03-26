"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { recommendations } from "@/lib/data"
import { Recommendation } from "@/types"

export default function RecommendationsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % recommendations.length)
  }, [])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length)
  }, [])

  // Auto-advance every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goNext()
    }, 6000)

    return () => clearInterval(interval)
  }, [activeIndex, goNext])

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const minSwipe = 50 // minimum swipe distance in px
    if (Math.abs(diff) > minSwipe) {
      if (diff > 0) {
        goNext() // swipe left = next
      } else {
        goPrev() // swipe right = prev
      }
    }
  }

  const currentRecommendation: Recommendation = recommendations[activeIndex]

  return (
    <section
      id="recommendations"
      className="py-8 md:py-12 text-center"
    >
      <h2 className="text-xl font-bold mb-6 text-foreground">
        Recommendations
      </h2>

      <div
        className="relative overflow-hidden h-[200px] sm:h-[180px] md:h-[160px] cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={currentRecommendation.id}
            className="absolute inset-x-0 top-0 flex flex-col justify-center h-full px-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
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
