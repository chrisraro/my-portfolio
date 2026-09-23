import { ArrowRight } from 'lucide-react'

// A link label ending in an arrow. The last word and the arrow never part, so a
// label that wraps on a phone does not leave the arrow alone on its own line.
export function ArrowLinkText({ text }: { text: string }) {
  const cut = text.lastIndexOf(' ') + 1
  return (
    <>
      {text.slice(0, cut)}
      <span className="whitespace-nowrap">
        {text.slice(cut)}
        <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4 align-[-0.125em]" />
      </span>
    </>
  )
}
