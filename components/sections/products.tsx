import { ProductPanel } from '@/components/ui/product-panel'
import { projects, sectionContent } from '@/lib/data'

// No Reveal here: the products are primary proof and render visible from the
// server HTML instead of waiting at opacity 0 for hydration.
export function Products() {
  const products = projects.filter((p) => p.band === 'Products')

  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
      <p className="eyebrow mb-3">{sectionContent.work.eyebrow}</p>
      <h2 id="work-title" className="text-fluid-h2 mb-8 text-ink">
        {sectionContent.work.title}
        {/* The board's "label · count" grammar. Hidden from the heading's name: three panels follow. */}
        <span aria-hidden="true" className="ml-3 font-mono text-sm font-normal text-muted">
          products · {products.length}
        </span>
      </h2>
      {/* Stacked, full-width panels: a list of running products, not a grid of screenshot cards. */}
      <div className="grid gap-4">
        {products.map((project) => (
          <ProductPanel key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
