import { FLAGSHIP_SLUGS, getCaseStudy } from '@/lib/case-studies'
import {
  aboutPageContent,
  availability,
  caseStudyContent,
  contactInfo,
  education,
  experience,
  heroContent,
  hirePageContent,
  projects,
  servicePages,
} from '@/lib/data'
import { DISPLAY_STATUS_LABEL, displayStatus } from '@/lib/display-status'
import { canLinkLive } from '@/lib/project-page'
import { SITE_URL, absoluteUrl } from '@/lib/site-metadata'
import { projectHref, siteRoutes } from '@/lib/site-routes'
import type { Project, ServicePage } from '@/types'

// /llms.txt and /llms-full.txt (llmstxt.org), built from the same content as
// the pages and the chat assistant, and listing every route in
// lib/site-routes.ts. Useful to non-Google tools; Google ignores them.
// Public email and social links only.

const url = (p: Project) => absoluteUrl(projectHref(p))
const serviceUrl = (s: ServicePage) => absoluteUrl(`/services/${s.slug}`)
const isFlagship = (p: Project) => FLAGSHIP_SLUGS.indexOf(p.slug) !== -1
const flagships = (): Project[] =>
  FLAGSHIP_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => Boolean(p))

function header(): string {
  return [
    `# ${heroContent.name}`,
    '',
    `> ${aboutPageContent.answer}`,
    '',
    `Based in ${contactInfo.location}. ${availability}.`,
  ].join('\n')
}

function servicesSection(): string {
  return ['## Services', '', ...servicePages.map((s) => `- [${s.name}](${serviceUrl(s)}): ${s.summary}`)].join('\n')
}

// The pages that are neither a service nor a project: the homepage, /services,
// /hire, /about and /projects, each with its meta description.
function pagesSection(): string {
  const pages = siteRoutes().filter((r) => r.kind !== 'service' && r.kind !== 'project')
  return ['## Pages', '', ...pages.map((r) => `- [${r.title}](${absoluteUrl(r.path)}): ${r.description}`)].join('\n')
}

function contact(): string {
  const links = contactInfo.socialLinks.filter((l) => l.url.startsWith('https://'))
  return ['## Contact', '', `- Email: ${contactInfo.email}`, ...links.map((l) => `- [${l.name}](${l.url})`)].join('\n')
}

export function buildLlmsTxt(): string {
  const others = projects.filter((p) => !isFlagship(p))
  return (
    [
      header(),
      servicesSection(),
      pagesSection(),
      ['## Case studies', '', ...flagships().map((p) => `- [${p.title}](${url(p)}): ${p.summary}`)].join('\n'),
      ['## Projects', '', ...others.map((p) => `- [${p.title}](${url(p)}): ${p.summary}`)].join('\n'),
      contact(),
      ['## Optional', '', `- [Full text of every page, project and case study](${SITE_URL}/llms-full.txt)`].join('\n'),
    ].join('\n\n') + '\n'
  )
}

function serviceBlock(s: ServicePage): string {
  const proof = s.projectIds
    .map((id) => projects.find((p) => p.id === id)?.title)
    .filter((t): t is string => Boolean(t))
  return [
    `### ${s.name}`,
    '',
    `Page: ${serviceUrl(s)}`,
    '',
    s.answer,
    ...s.sections.flatMap((q) => ['', `#### ${q.question}`, '', ...q.answer]),
    '',
    `Projects that prove it: ${proof.join(', ')}`,
  ].join('\n')
}

function aboutSection(): string {
  return [
    '## About',
    '',
    `Page: ${absoluteUrl('/about')}`,
    '',
    aboutPageContent.answer,
    '',
    aboutPageContent.story.paragraphs.join('\n\n'),
  ].join('\n')
}

function hireSection(): string {
  return [
    '## Hire',
    '',
    `Page: ${absoluteUrl('/hire')}`,
    '',
    hirePageContent.answer,
    '',
    ...hirePageContent.howIWork.notes.map((n) => `- ${n.title}: ${n.body}`),
  ].join('\n')
}

function projectBlock(p: Project): string {
  const lines = [`### ${p.title}`, '', `${p.band} · ${DISPLAY_STATUS_LABEL[displayStatus(p.status)]} · ${p.summary}`, `Page: ${url(p)}`]
  if (canLinkLive(p)) lines.push(`Live site: ${p.links.live}`)
  lines.push('', p.description, '', `Stack: ${p.technologies.join(', ')}`)

  const study = getCaseStudy(p.slug)
  if (study) {
    const h = caseStudyContent.headings
    lines.push(
      '', `Role: ${study.role}`,
      '', `#### ${h.brief}`, '', ...study.brief,
      '', `#### ${h.built}`, '', ...study.built,
      '', `#### ${h.decisions}`, '', ...study.decisions.map((d) => `- ${d.chose} over ${d.over}: ${d.because}`),
      '', `#### ${h.stack}`, '', ...study.stack.map((s) => `- ${s.name}: ${s.why}`),
      '', `#### ${h.outcome}`, '', ...study.outcome,
    )
    if (study.metrics && study.metrics.length > 0) lines.push('', ...study.metrics.map((m) => `- ${m.value} ${m.label}`))
  }
  return lines.join('\n')
}

export function buildLlmsFullTxt(): string {
  const ordered = flagships().concat(projects.filter((p) => !isFlagship(p)))
  return (
    [
      header(),
      ['## Services', '', servicePages.map(serviceBlock).join('\n\n')].join('\n'),
      aboutSection(),
      hireSection(),
      ['## Projects', '', ordered.map(projectBlock).join('\n\n')].join('\n'),
      ['## Experience', '', ...experience.map((e) => `- ${e.title}, ${e.company}, ${e.location} (${e.dates}): ${e.responsibilities.join('; ')}`)].join('\n'),
      ['## Education', '', ...education.map((e) => `- ${e.degree}, ${e.school} (${e.dates})${e.honors ? `, ${e.honors}` : ''}`)].join('\n'),
      contact(),
    ].join('\n\n') + '\n'
  )
}
