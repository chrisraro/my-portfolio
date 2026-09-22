import { ProductPanel } from '@/components/ui/product-panel'
import { Reveal } from '@/components/ui/reveal'
import { projects, sectionContent } from '@/lib/data'

export function Products() {
  const products = projects.filter((p) => p.band === 'Products')

  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
      <p className="eyebrow mb-3">{sectionContent.work.eyebrow}</p>
      <h2 id="work-title" className="text-fluid-h2 mb-8 text-ink">
        {sectionContent.work.title}
        <span className="ml-3 font-mono text-base font-normal text-muted">{products.length}</span>
      </h2>
      <div className="grid gap-5 md:grid-cols-3">
        {products.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.06} className="h-full">
            <ProductPanel project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
