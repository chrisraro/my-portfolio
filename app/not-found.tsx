import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { notFoundContent } from '@/lib/data'

// Every unknown address lands here, including an unknown /projects/<slug>
// (that route sets dynamicParams = false and calls notFound()).
export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <p className="eyebrow mb-3">{notFoundContent.eyebrow}</p>
      <h1 className="text-fluid-h1 mb-4 text-ink">{notFoundContent.title}</h1>
      <p className="max-w-2xl text-lg text-muted-strong">{notFoundContent.description}</p>
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8">
        <Link
          href="/projects"
          className="inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 py-2.5 font-medium text-on-accent transition-colors hover:bg-accent/90"
        >
          All projects
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <Link href="/" className="inline-flex min-h-[44px] items-center font-mono text-sm text-muted-strong hover:text-accent">
          Back to the homepage
        </Link>
      </div>
    </div>
  )
}
