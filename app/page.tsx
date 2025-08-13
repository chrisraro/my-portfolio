import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { WorksSection } from '@/components/sections/works-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ContactSection } from '@/components/sections/contact-section'
import { ExperienceSection } from '@/components/sections/experience-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WorksSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
    </>
  )
}
