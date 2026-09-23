import type { CaseStudy } from '@/types'

// The five projects with a full case study, in reading order: the "next case
// study" link follows it. Every other project gets a short page built from
// lib/data.ts alone. Spec: docs/superpowers/specs/2026-09-23-case-studies-design.md
export const FLAGSHIP_SLUGS: readonly string[] = [
  'el-nido-guide-ph',
  'beachbus-palawan',
  'acad1-review-center',
  'aman-group-web-app',
  'giya',
]

// Entries are added as Christian answers each research dossier's questions.
// Nothing here is drafted from memory: see the dossiers in
// docs/case-studies/research/ (gitignored, may hold client numbers).
export const caseStudies: CaseStudy[] = [
  {
    slug: 'el-nido-guide-ph',
    role: 'Sole developer: build and ongoing maintenance',
    brief: [
      'Travellers coming to El Nido, Palawan had to find and message many tour operators separately. The site had to let them plan and book tours, transfers and activities in one place.',
      'The local operators took bookings by chat and were paid in cash. The site had to give them online booking and card or e-wallet payment.',
    ],
    built: [
      'I built El Nido Guide as a multi-vendor marketplace on WordPress, WooCommerce and Dokan. Each local operator runs its own store on the site and adds and updates its own tours and prices.',
      'Island-hopping tours follow the four government-regulated routes, Tours A to D, and several operators list their own version of each. The site also lists airport transfers, diving and freediving classes, cooking classes and other activities.',
      'Bookings run on WPS Bookings for WooCommerce. Tour pages offer optional add-ons such as mask, fin and GoPro rentals, and every booking has a printable invoice. The site runs on a custom GeneratePress child theme, and checkout takes PayPal and Maya.',
    ],
    decisions: [
      {
        chose: 'Dokan multi-vendor marketplace',
        over: 'a single store',
        because: 'Each operator receives its own booking money, so the platform never holds their funds. Operators also add and update their own tours and prices, so the owner does not maintain dozens of listings.',
      },
      {
        chose: 'WordPress and WooCommerce',
        over: 'a custom-coded app',
        because: 'The client and the operators can manage content, listings and bookings without a developer. Mature booking, multi-vendor and payment plugins also meant a faster, safer launch than building those from scratch.',
      },
      {
        chose: 'PayPal and Maya',
        over: 'a single payment gateway',
        because: 'PayPal serves international travellers, and Maya serves Filipino travellers who pay by card or e-wallet.',
      },
    ],
    stack: [
      { name: 'WordPress and WooCommerce', why: 'The client and operators manage listings and bookings without a developer.' },
      { name: 'Dokan and Dokan Pro', why: 'Turn the store into a marketplace where each operator runs its own store.' },
      { name: 'WPS Bookings for WooCommerce', why: 'Takes bookings for tours and activities.' },
      { name: 'GeneratePress and GenerateBlocks', why: 'The base of the custom child theme.' },
      { name: 'WooCommerce PayPal Payments', why: 'Takes payment from international travellers.' },
      { name: 'Payments via Maya for WooCommerce', why: 'Takes card and e-wallet payment from Filipino travellers.' },
    ],
    outcome: [
      'The site is live. Its homepage lists 41 verified local operators, and every booking pays the operator directly.',
      'I have built every version of the site, from the first to the latest, and I still maintain it.',
    ],
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug)
}

/** Every string a visitor can read on the case study, for copy checks. */
export function caseStudyText(s: CaseStudy): string[] {
  return [
    s.role,
    ...s.brief,
    ...s.built,
    ...s.decisions.map((d) => `${d.chose} ${d.over} ${d.because}`),
    ...s.stack.map((i) => `${i.name} ${i.why}`),
    ...s.outcome,
    ...(s.metrics ?? []).map((m) => `${m.value} ${m.label}`),
  ]
}
