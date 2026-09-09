import {
  contactInfo,
  education,
  experience,
  heroContent,
  paymentGateways,
  projects,
  recommendations,
  skills,
} from '@/lib/data'

// This file is the assistant's only source of portfolio facts. The route used
// to carry a hand-written prose copy alongside the generated one, and the two
// diverged: the prose advertised projects that were not on the site and omitted
// ones that were. Everything here derives from lib/data.ts so that cannot recur.
export function buildPortfolioContext(): string {
  const projectsList = projects
    .map((p) => {
      const link = p.links.live ? ` | URL: ${p.links.live}` : ''
      const when = p.dates ? ` | ${p.dates}` : ''
      const flag = p.featured ? ' [FEATURED]' : ''
      return `- ${p.title} (${p.band}): ${p.description} | Tech: ${p.technologies.join(', ')}${link}${when}${flag}`
    })
    .join('\n')

  const byCategory = (category: string) =>
    skills.filter((s) => s.category === category).map((s) => s.name).join(', ')

  const experienceList = experience
    .map((e) => {
      const note = e.concurrent ? ` (${e.concurrent})` : ''
      return `- ${e.title} at ${e.company}, ${e.location} (${e.dates})${note}\n    ${e.responsibilities.join('; ')}`
    })
    .join('\n')

  const educationList = education
    .map((e) => `- ${e.degree}, ${e.school} (${e.dates})${e.honors ? ` — ${e.honors}` : ''}`)
    .join('\n')

  const recommendationsList = recommendations
    .map((r) => `- "${r.quote}" — ${r.authorName}, ${r.authorTitle}`)
    .join('\n')

  return `
OWNER INFORMATION:
- Name: Christian Raro
- Title: ${heroContent.title}
- Location: ${contactInfo.location}
- Email: ${contactInfo.email}
- Proof points: ${heroContent.proofPoints.join('. ')}.

PROJECTS (${projects.length} total, grouped into Products, Custom systems, Applications and Sites):
${projectsList}

TECHNICAL SKILLS:
Frontend: ${byCategory('Frontend')}
Backend: ${byCategory('Backend')}
Tools & DevOps: ${byCategory('Tools & DevOps')}
Payment gateways integrated: ${paymentGateways.join(', ')}

WORK EXPERIENCE:
${experienceList}

EDUCATION:
${educationList}

RECOMMENDATIONS:
${recommendationsList}

SERVICES OFFERED:
- Full-stack web application development (Next.js, React, Node.js)
- WordPress website development and customisation
- E-commerce with WooCommerce and Philippine payment gateways
- Custom internal tools and hardware integrations
- API integrations

CONTACT:
- Email: ${contactInfo.email}
- Location: ${contactInfo.location}
- Social links: GitHub (github.com/chrisraro), LinkedIn (linkedin.com/in/christian-raro)
- For anything else, direct people to the contact form or email.
`
}

export const SYSTEM_PROMPT = `You are "Chunks", the AI assistant for Christian Raro's portfolio website. Christian is a full-stack web developer based in Naga City, Camarines Sur, Philippines.

RULES:
1. Keep responses SHORT — 1-2 sentences max unless the user asks for detail
2. Be direct, friendly, and conversational
3. Only answer questions about Christian's portfolio, projects, skills, experience, education, and services
4. For business inquiries, direct to the contact form or email (${contactInfo.email})
5. Politely decline off-topic questions in one sentence
6. Never generate harmful or inappropriate content
7. Don't make up information — say you don't know. In particular, never name a project that is not in the PORTFOLIO DATA below
8. Never share personal contact details beyond the public email and social links — no phone number, no home address. Point people at the contact form instead.

PORTFOLIO DATA:
${buildPortfolioContext()}

Be concise. No fluff.`
