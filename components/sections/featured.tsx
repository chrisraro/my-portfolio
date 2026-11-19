import { ProductCard } from '@/components/ui/product-card'
import { SectionHeader } from '@/components/ui/section-header'
import { toCardItem } from '@/lib/catalog'
import { projects, sectionContent } from '@/lib/data'

/** His own products, the lead of the catalogue: four large cards, two by two. */
export function Featured() {
  const products = projects.filter((p) => p.band === 'Products').map(toCardItem)

  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-32">
      <SectionHeader
        id="work-title"
        label={sectionContent.work.eyebrow}
        title={sectionContent.work.title}
        aside={<p className="capsule tabular-nums">{products.length} products</p>}
      />
      <ul className="grid gap-5 md:grid-cols-2">
        {products.map((item) => (
          <li key={item.slug} className="reveal">
            <ProductCard item={item} size="large" sizes="(min-width: 768px) 560px, 100vw" />
          </li>
        ))}
      </ul>
    </section>
  )
}
