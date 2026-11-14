import { SectionHeading } from '@/components/ui/section-heading'
import { sectionContent, skills } from '@/lib/data'

/**
 * The brochure's back panel, its "amenities": each category a column of
 * skills on dotted leaders, in the order lib/data.ts gives them. WordPress &
 * e-commerce, the specialism, is the first column.
 * No scroll motion: a quiet passage after the dense ones.
 */
export function Stack() {
  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <section id="stack" aria-labelledby="stack-title" className="defer-render mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <SectionHeading id="stack-title" eyebrow={sectionContent.stack.eyebrow} title={sectionContent.stack.title} />
      <dl className="grid gap-x-10 gap-y-10 border-t border-line pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.35fr_repeat(4,minmax(0,1fr))]">
        {categories.map((category) => (
          <div key={category}>
            <dt className="edge-code mb-4 text-sm text-ink">{category}</dt>
            <dd>
              <ul>
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <li key={skill.id} className="flex items-end gap-2 py-1.5">
                      <span className="shrink-0 text-ink">{skill.name}</span>
                      <span aria-hidden="true" className="mb-[0.45em] flex-1 border-b-2 border-dotted border-line-strong" />
                    </li>
                  ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
