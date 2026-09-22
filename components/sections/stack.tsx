import { sectionContent, skills } from '@/lib/data'

export function Stack() {
  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <section id="stack" aria-labelledby="stack-title" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 md:pb-20 md:pt-14">
        <p className="eyebrow mb-3">{sectionContent.stack.eyebrow}</p>
        <h2 id="stack-title" className="text-fluid-h2 mb-8 text-ink">
          {sectionContent.stack.title}
        </h2>
        {/* Hairline cells, the proof band's construction: one grid, gap-px on the line colour. */}
        <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="bg-panel p-5">
              <dt className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-accent">
                {category}
              </dt>
              <dd>
                <ul className="space-y-1.5 font-mono text-sm text-ink">
                  {skills
                    .filter((s) => s.category === category)
                    .map((skill) => (
                      <li key={skill.id}>{skill.name}</li>
                    ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
