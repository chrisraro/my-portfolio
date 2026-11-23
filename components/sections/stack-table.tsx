import { ListHeading } from '@/components/ui/section-heading'
import { SECTION } from '@/components/ui/grid'
import { paymentGateways, sectionContent, skills } from '@/lib/data'
import { cn } from '@/lib/utils'

/** The stack as a definition table: one row per category, plus the payment gateways. */
export function StackTable() {
  const { stack } = sectionContent
  const categories = skills.map((s) => s.category).filter((c, i, all) => all.indexOf(c) === i)
  const rows = [
    ...categories.map((c) => ({ label: c as string, items: skills.filter((s) => s.category === c).map((s) => s.name) })),
    { label: stack.gateways, items: [...paymentGateways] },
  ]

  return (
    <section id="stack" aria-labelledby="stack-title" className={cn(SECTION, 'pt-24')}>
      <ListHeading id="stack-title" title={stack.title} count={rows.reduce((n, r) => n + r.items.length, 0)} />
      <dl>
        {rows.map((r) => (
          <div key={r.label} className="rise-in grid gap-x-6 gap-y-1 border-b border-line py-3.5 sm:grid-cols-[12rem_1fr]">
            <dt className="text-muted">{r.label}</dt>
            <dd className="text-ink">{r.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
