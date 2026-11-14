import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { notFoundContent } from '@/lib/data'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-center px-5 py-20 sm:px-8">
      <p className="enter display-num text-gray-mid">{notFoundContent.eyebrow}</p>
      <h1 className="display-lg mt-4 max-w-[14ch]">
        <span className="mask">
          <span>{notFoundContent.title}</span>
        </span>
      </h1>
      <p className="enter lede mt-5 max-w-[34rem] text-gray-text">{notFoundContent.description}</p>
      <div className="enter mt-8 flex flex-wrap gap-3">
        <Link href="/projects" className="btn btn-primary">
          Browse every project
          <ArrowRight aria-hidden="true" className="nudge h-4 w-4" />
        </Link>
        <Link href="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
    </div>
  )
}
