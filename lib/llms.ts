import { FLAGSHIP_SLUGS, getCaseStudy } from '@/lib/case-studies'
import { availability, caseStudyContent, contactInfo, education, experience, heroContent, projects, services } from '@/lib/data'
import { DISPLAY_STATUS_LABEL, displayStatus } from '@/lib/display-status'
import { canLinkLive, projectHref } from '@/lib/project-page'
import { SITE_URL } from '@/lib/site-metadata'
import type { Project } from '@/types'

// /llms.txt and /llms-full.txt (llmstxt.org), built from the same content as
// the page and the chat assistant. Public email and social links only.

const url = (p: Project) => `${SITE_URL}${projectHref(p)}`
const isFlagship = (p: Project) => FLAGSHIP_SLUGS.indexOf(p.slug) !== -1
const flagships = (): Project[] =>
  FLAGSHIP_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => Boolean(p))

function header(): string {
  return [
    `# ${heroContent.name}`,
    '',
    `> ${heroContent.title} · ${heroContent.specialism}`,
    '',
    `${heroContent.lede} Based in ${contactInfo.location}. ${availability}.`,
  ].join('\n')
}

function servicesSection(): string {
  return ['## Services', '', ...services.map((s) => `- ${s}`)].join('\n')
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
      ['## Case studies', '', ...flagships().map((p) => `- [${p.title}](${url(p)}): ${p.summary}`)].join('\n'),
      ['## Projects', '', ...others.map((p) => `- [${p.title}](${url(p)}): ${p.summary}`)].join('\n'),
      contact(),
      ['## Optional', '', `- [Full text of every project and case study](${SITE_URL}/llms-full.txt)`].join('\n'),
    ].join('\n\n') + '\n'
  )
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
      servicesSection(),
      ['## Projects', '', ordered.map(projectBlock).join('\n\n')].join('\n'),
      ['## Experience', '', ...experience.map((e) => `- ${e.title}, ${e.company}, ${e.location} (${e.dates}): ${e.responsibilities.join('; ')}`)].join('\n'),
      ['## Education', '', ...education.map((e) => `- ${e.degree}, ${e.school} (${e.dates})${e.honors ? `, ${e.honors}` : ''}`)].join('\n'),
      contact(),
    ].join('\n\n') + '\n'
  )
}
