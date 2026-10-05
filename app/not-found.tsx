import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { notFoundContent } from '@/lib/data'

// Every unknown address lands here, including an unknown /projects/<slug>
// (that route sets dynamicParams = false and calls notFound()).
//
// An empty pocket in the rack: the lip and ledge, and where a brochure should
// stand, a dashed slot with a printed tag reading the eyebrow.
export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 md:pb-24 md:pt-16">
      <div className="grid items-end gap-10 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-16">
        <div className="w-40 md:w-full">
          <div className="flex aspect-[100/78] items-end justify-center rounded-t border border-b-0 border-dashed border-line-strong px-4 pb-6">
            <p className="eyebrow rotate-[-4deg] rounded-sm border border-line-strong bg-panel px-3 py-1.5 text-ink">
              {notFoundContent.eyebrow}
            </p>
          </div>
          <span aria-hidden="true" className="block h-[14px] border-t-2 border-line-strong bg-panel" />
        </div>
        <div>
          <h1 className="text-page-h1 max-w-[16ch] text-ink">{notFoundContent.title}</h1>
          <p className="text-lede mt-5 max-w-2xl text-muted-strong">{notFoundContent.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/projects"
              className="press button-primary"
            >
              All projects
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
            <Link href="/" className="button-label inline-flex min-h-[44px] items-center text-ink hover:text-accent">
              <span className="link-draw">Back to the homepage</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
