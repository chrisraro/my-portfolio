import { SectionHeader } from '@/components/ui/section-header'
import { sectionContent, skills } from '@/lib/data'

/** The stack as one grouped list: a row per category, its tools as capsules. */
export function Stack() {
  const categories = Array.from(new Set(skills.map((s) => s.category)))
  return (
    <section id="stack" aria-labelledby="stack-title" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-32">
      <SectionHeader id="stack-title" label={sectionContent.stack.eyebrow} title={sectionContent.stack.title} />
      <dl className="group-list reveal">
        {categories.map((category) => (
          <div key={category} className="grid gap-3 p-5 sm:px-7 md:grid-cols-[16rem_1fr] md:items-center md:gap-8">
            <dt className="font-medium">{category}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <li key={skill.id} className="capsule">
                      {skill.name}
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
