import { SectionHeading } from '@/components/ui/section-heading'
import { sectionContent, skills } from '@/lib/data'

/**
 * The stack as a short ledger: one row per category, its skills set in a
 * line, in the order lib/data.ts gives them. WordPress & e-commerce, the
 * specialism, is the first row. No scroll motion: a quiet passage.
 */
export function Stack() {
  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <section id="stack" aria-labelledby="stack-title" className="defer-render mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <SectionHeading id="stack-title" eyebrow={sectionContent.stack.eyebrow} title={sectionContent.stack.title} />
      <dl className="border-b border-line">
        {categories.map((category) => (
          <div key={category} className="grid gap-2 border-t border-line py-4 md:grid-cols-[16rem_1fr] md:items-baseline md:gap-8">
            <dt className="edge-code text-sm text-muted-strong">{category}</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-8 gap-y-1">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <li key={skill.id} className="text-lg text-ink">{skill.name}</li>
                  ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
