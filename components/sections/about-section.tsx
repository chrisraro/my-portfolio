'use client'

import { Reveal } from '@/components/ui/reveal'

export function AboutSection() {
  return (
    <section id="about">
      <Reveal>
        <p className="eyebrow mb-2">// about</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight mb-4">About</h2>
      </Reveal>

      <Reveal delay={0.1} className="space-y-3 text-muted-foreground leading-relaxed text-base">
        <p>
          I&apos;m Christian Raro — a software engineer and full-stack developer from Naga City,
          Philippines. I build production web apps with Next.js, React, and TypeScript, and ship
          client-ready WordPress and WooCommerce sites end to end.
        </p>
        <p>
          My work spans real-estate platforms, hotel booking systems, and AI-assisted study tools.
          I care about clean, maintainable code and interfaces that feel effortless.
        </p>
        <p>
          I move fast with modern AI-assisted workflows, and I&apos;m always exploring new tools to
          solve real-world problems through software.
        </p>
      </Reveal>
    </section>
  )
}
