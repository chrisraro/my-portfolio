import type { ReactNode } from 'react'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { WorksSection } from '@/components/sections/works-section'
import { GallerySection } from '@/components/sections/gallery-section'
import { RecommendationsSection } from '@/components/sections/recommendations-section'
import { ExperienceSection } from '@/components/sections/experience-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ContactSection } from '@/components/sections/contact-section'

// Pre-4.0 sections relied on the old page's max-w-4xl wrapper. Each keeps it
// until the task that replaces it; new sections manage their own width.
function LegacySlot({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 sm:px-6">{children}</div>
}

// Section order is final (spec §6). Tasks 7–11 each swap one slot.
export default function HomePage() {
  return (
    <>
      <LegacySlot>
        <HeroSection />
        <AboutSection />
      </LegacySlot>
      <LegacySlot>
        <WorksSection />
      </LegacySlot>
      <LegacySlot>
        <GallerySection />
        <RecommendationsSection />
      </LegacySlot>
      <LegacySlot>
        <ExperienceSection />
        <SkillsSection />
      </LegacySlot>
      <LegacySlot>
        <ContactSection />
      </LegacySlot>
    </>
  )
}
