import { caseStudyContent } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

/** The printed tag's copy: why this project has no picture. */
export function noPreviewCopy(project: Project): string {
  if (project.status === 'auth-gated') return caseStudyContent.noPreview['auth-gated']
  if (project.status === 'internal') return caseStudyContent.noPreview.internal
  return caseStudyContent.noPreview.fallback
}

// Honest absence: a project with no public preview keeps its slot with a
// printed tag saying why, instead of a fake picture.
export function NoPreviewTag({ project, className }: { project: Project; className?: string }) {
  return (
    <span
      className={cn(
        'flex flex-col justify-end gap-3 rounded border border-dashed border-line-strong bg-canvas p-4',
        className,
      )}
    >
      <span aria-hidden="true" className="block border-t border-dashed border-line-strong" />
      <span className="text-sm leading-snug text-muted-strong">{noPreviewCopy(project)}</span>
    </span>
  )
}
