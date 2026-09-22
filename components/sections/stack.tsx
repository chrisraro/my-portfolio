import { sectionContent, skills } from '@/lib/data'

export function Stack() {
  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <section id="stack" aria-labelledby="stack-title" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <p className="eyebrow mb-3">{sectionContent.stack.eyebrow}</p>
        <h2 id="stack-title" className="text-fluid-h2 mb-10 text-ink">
          {sectionContent.stack.title}
        </h2>
        <dl className="grid gap-8 sm:grid-cols-3">
          {categories.map((category) => (
            <div key={category}>
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
