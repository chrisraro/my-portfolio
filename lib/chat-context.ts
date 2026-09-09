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

  // Derived rather than a fixed Frontend/Backend/Tools & DevOps list, so a
  // category added to the Skill type in the future shows up here too.
  const skillCategories = Array.from(new Set(skills.map((s) => s.category)))
  const skillsList = skillCategories
    .map((category) => `${category}: ${skills.filter((s) => s.category === category).map((s) => s.name).join(', ')}`)
    .join('\n')

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
- The site's hero states: "${heroContent.proofPoints.join('. ')}."

PROJECTS (${projects.length} total, grouped into Products, Custom systems, Applications and Sites):
${projectsList}

TECHNICAL SKILLS:
${skillsList}
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

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
]
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

// Spells out small non-negative integers so counts read as natural-language
// words in prose rather than digits. Portfolio-scale counts (products,
// projects) never approach three digits, so 0-99 coverage is enough.
export function numberToWords(n: number): string {
  if (n < 20) return ONES[n]
  if (n < 100) {
    const tens = TENS[Math.floor(n / 10)]
    const ones = n % 10
    return ones === 0 ? tens : `${tens}-${ONES[ones]}`
  }
  return String(n)
}

// The chat route's offline fallback, shown when GROQ_API_KEY is unset. It used
// to hand-type "three products of his own, fifteen projects shipped" directly
// in app/api/chat/route.ts — a second copy of portfolio facts in the very file
// this module exists to keep those facts out of. Derived from the same
// `projects` array as the rest of this file, so it cannot drift.
const productCount = projects.filter((p) => p.band === 'Products').length
const projectCount = projects.length

export const OFFLINE_REPLY = `I'm currently running in offline mode. I can still point you around: Christian is a full-stack web developer in Naga City — ${numberToWords(productCount)} products of his own, ${numberToWords(projectCount)} projects shipped. Explore the portfolio or use the contact form to reach him directly.`
