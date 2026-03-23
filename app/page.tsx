'use client'

import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { CredentialsSidebar } from '@/components/sections/credentials-sidebar'
import { ExperienceSection } from '@/components/sections/experience-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { WorksSection } from '@/components/sections/works-section'
import RecommendationsSection from '@/components/sections/recommendations-section'
import GallerySection from '@/components/sections/gallery-section'
import { ContactSection } from '@/components/sections/contact-section'

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Hero Row: Image left + Info right */}
      <HeroSection />

      {/* Bento Row: About left + Credentials right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 py-6">
        <div className="lg:col-span-3">
          <AboutSection />
        </div>
        <div className="lg:col-span-2">
          <CredentialsSidebar />
        </div>
      </div>

      {/* Bento Row: Tech Stack left + Experience right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-6">
        <SkillsSection />
        <ExperienceSection />
      </div>

      {/* Full-width rows */}
      <WorksSection />
      <RecommendationsSection />
      <GallerySection />
      <ContactSection />
    </div>
  )
}
