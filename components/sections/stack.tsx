import { SectionHeading } from '@/components/ui/section-heading'
import { sectionContent, skills } from '@/lib/data'
import { cn } from '@/lib/utils'

/**
 * The brochure's back panel, its "amenities": each category a column of
 * skills on dotted leaders. WordPress, the specialism, sits on a paper chip.
 * No scroll motion: a quiet passage after the dense ones.
 */
export function Stack() {
  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <section id="stack" aria-labelledby="stack-title" className="mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <SectionHeading id="stack-title" eyebrow={sectionContent.stack.eyebrow} title={sectionContent.stack.title} />
      <dl className="grid gap-x-10 gap-y-10 border-t border-line pt-6 sm:grid-cols-3">
        {categories.map((category) => (
          <div key={category}>
            <dt className="edge-code mb-4 text-sm text-ink">{category}</dt>
            <dd>
              <ul>
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <li key={skill.id} className="flex items-end gap-2 py-1.5">
                      <span
                        className={cn(
                          'shrink-0 text-ink',
                          skill.id === 'wordpress' && '-mx-2.5 rounded-full bg-panel px-2.5',
                        )}
                      >
                        {skill.name}
                      </span>
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
