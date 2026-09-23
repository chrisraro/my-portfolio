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
      'The site runs on a custom GeneratePress child theme. Bookings run on WPS Bookings for WooCommerce. Tour pages offer optional add-ons such as mask, fin and GoPro rentals, and every booking has a printable invoice. Checkout takes PayPal and Maya.',
      'Island-hopping tours follow the four government-regulated routes, Tours A to D, and several operators list their own version of each. The site also lists airport transfers, diving and freediving classes, cooking classes and other activities.',
    ],
    decisions: [
      {
        chose: 'WordPress and WooCommerce',
        over: 'a custom-coded app',
        because: 'The client and the operators can manage content, listings and bookings without a developer. Mature booking, multi-vendor and payment plugins also meant a faster, safer launch than building those from scratch.',
      },
      {
        chose: 'Dokan multi-vendor marketplace',
        over: 'a single store',
        because: 'Each operator receives its own booking money, so the platform never holds their funds. Operators also add and update their own tours and prices, so the owner does not maintain dozens of listings.',
      },
      {
        chose: 'PayPal and Maya',
        over: 'a single payment gateway',
        because: 'PayPal serves international travellers, and Maya serves Filipino travellers who pay by card or e-wallet.',
      },
    ],
    stack: [
      { name: 'WordPress and WooCommerce', why: 'Run the catalog, bookings and checkout.' },
      { name: 'Dokan and Dokan Pro', why: 'Turn the store into a marketplace where each operator runs its own store.' },
      { name: 'WPS Bookings for WooCommerce', why: 'Takes bookings for tours and activities.' },
      { name: 'GeneratePress and GenerateBlocks', why: 'The base of the custom child theme.' },
      { name: 'WooCommerce PayPal Payments', why: 'Card and PayPal checkout for international travellers.' },
      { name: 'Payments via Maya for WooCommerce', why: 'Card and e-wallet checkout for Filipino travellers.' },
    ],
    outcome: [
      'I have built every version of the site, from the first to the latest, and I still maintain it.',
      'Its homepage lists verified local operators, and every booking pays the operator directly.',
    ],
    metrics: [{ value: '41', label: 'verified local operators listed on the site', clientApproved: true }],
  },
  {
    slug: 'beachbus-palawan',
    role: 'Sole developer: website, NFC card system and ongoing maintenance',
    brief: [
      'BeachBus runs a hop-on, hop-off shuttle between the beaches of El Nido, Palawan. It needed a website where travellers could see the routes and the timetable and buy passes.',
      'It also needed a way to get riders on board without handling cash on every trip.',
    ],
    built: [
      'I built the website on WordPress and WooCommerce, with a GeneratePress child theme and GenerateBlocks. It has a route map, a trip planner, the timetable and a catalog of 1, 3 and 5 day passes. Later I added monthly passes for residents and workers. Checkout takes PayPal, PayMongo and Maya.',
      'Local businesses act as Partner Hubs. They sell or redeem passes and earn a commission, which runs on Dokan and a coupon-affiliates plugin.',
      'I also built a separate NFC card system. It is a web dashboard that issues cards and records taps from NFC readers, and it runs apart from the WooCommerce orders. A rider collects a physical card at a Partner Hub or from the conductor, then taps it to board.',
    ],
    decisions: [
      {
        chose: 'NFC tap cards',
        over: 'QR codes or an app',
        because: 'Riders need no phone, battery or signal at the beach. A tap is also quicker than scanning, and conductors no longer handle cash.',
      },
      {
        chose: 'Three payment gateways',
        over: 'a single payment gateway',
        because: 'PayPal serves international tourists, and PayMongo and Maya serve Filipino riders who pay by card or e-wallet. With three, a sale still goes through if one gateway is down or declines.',
      },
    ],
    stack: [
      { name: 'WordPress and WooCommerce', why: 'Run the pass catalog and checkout.' },
      { name: 'GeneratePress and GenerateBlocks', why: 'The base of the child theme and the page layouts.' },
      { name: 'Dokan and Coupon Affiliates for WooCommerce', why: 'Let Partner Hubs sell passes and earn a commission.' },
      { name: 'WooCommerce PayPal Payments', why: 'Takes payment from international tourists.' },
      { name: 'PayMongo and Maya for WooCommerce', why: 'Take card and e-wallet payment from Filipino riders.' },
      { name: 'NFC readers and a custom web dashboard', why: 'Issue cards and record each tap when a rider boards.' },
    ],
    outcome: [
      'The route, the timetable and the pass catalog are public at beachbus.ph. Boarding is a card tap, with no cash.',
      'I still maintain both the site and the card system, and I later added monthly passes. Online pass sales are paused for now.',
    ],
    related: ['beachbus-nfc-card-system'],
  },
  {
    slug: 'acad1-review-center',
    role: 'Sole developer: full build and occasional support',
    brief: [
      'ACAD1 Review Center runs entrance-test review programmes for college, senior high school, science high school and medical school admission. It teaches at several branches and also runs an online programme.',
      'Students reserved a slot in person or by chat, and staff checked each payment by hand. ACAD1 needed a way for students to reserve and pay online.',
    ],
    built: [
      'I built the whole WordPress site: the theme, the pages and the programme listings. It runs on GeneratePress and GenerateBlocks. A branches page lists every branch and the online programme, and the listings show each programme\'s tiers and class schedules per branch.',
      'Reservations run on WooCommerce. Each programme listing has an Enroll Now button that leads to the cart and checkout. A student reserves a slot with a 50% downpayment and settles the balance before the first session. A deposits plugin I set up and configured handles the downpayment and the balance, and checkout goes through Xendit.',
    ],
    decisions: [
      {
        chose: 'Xendit',
        over: 'PayMongo',
        because: 'ACAD1 already had a Xendit merchant account, so I built checkout on it.',
      },
      {
        chose: 'A 50% downpayment',
        over: 'full payment up front',
        because: 'It mirrors the reservation policy ACAD1 already used in person. Families can secure a slot without paying everything at once and settle the balance later.',
      },
      {
        chose: 'A configured deposits plugin',
        over: 'custom code',
        because: 'A maintained plugin handles deposits, balances and emails reliably, and the client can manage it without a developer. It was also faster to launch, and reservations had to be live before a review season.',
      },
    ],
    stack: [
      { name: 'WordPress and WooCommerce', why: 'Run the site, the programme listings and the reservation checkout.' },
      { name: 'GeneratePress and GenerateBlocks', why: 'The theme and the page layouts.' },
      { name: 'A WooCommerce deposits plugin', why: 'Takes the downpayment and handles the balance and its emails.' },
      { name: 'Xendit', why: 'Takes payment at checkout on ACAD1\'s existing merchant account.' },
    ],
    outcome: [
      'Students now reserve a slot at any branch online, instead of in person or by chat. Xendit confirms each payment, so staff no longer check transfers by hand.',
      'The site is live, and I still do occasional work on it when ACAD1 asks.',
    ],
  },
  {
    slug: 'aman-group-web-app',
    role: 'Sole developer: built in-house as IT Staff and Web Developer at Enjoy Realty',
    brief: [
      'Aman Group of Companies is a residential developer in Naga City, operating since 1989. Its projects are built by two developers in the group, Enjoy Realty and Development Corporation and Aman Engineering.',
      'The group needed one place to show its projects and properties. Its buyers and brokers also needed a way to work out how to finance a home.',
    ],
    built: [
      'I built the Aman Group web app in Next.js 14, hosted on Vercel. It has pages for the properties, the developers, a loan calculator and contact details.',
      'The properties page shows each property series under its residence project, such as the townhouse and lot series of Parkview Naga Urban Residence. Each series has an image, a description and its key features.',
      'The loan calculator compares Pag-IBIG, bank and in-house financing and estimates the monthly payment for each. The app keeps its listings, settings and leads in Upstash Redis through Vercel KV.',
    ],
    decisions: [
      {
        chose: 'A Next.js app',
        over: 'a WordPress site',
        because: 'The loan calculator and the property explorer needed custom interactive UI, which is awkward to build in WordPress. A fast, statically rendered app on Vercel also needs no plugin upkeep.',
      },
      {
        chose: 'Upstash Redis and Vercel KV',
        over: 'Supabase',
        because: 'Supabase was the first plan, but the app only stores small key-value data such as listings, settings and leads. It does not need a relational database. Vercel\'s integrated KV also means no separate database to manage or pay for.',
      },
    ],
    stack: [
      { name: 'Next.js and React', why: 'Build the showcase pages and the interactive loan calculator.' },
      { name: 'Vercel', why: 'Hosts the app, with no plugins to keep up to date.' },
      { name: 'Upstash Redis and Vercel KV', why: 'Store the listings, settings and leads as key-value data.' },
      { name: 'Tailwind CSS', why: 'Styles the pages.' },
    ],
    outcome: [
      'I presented the app at Enjoy Realty\'s brokers\' meeting as the company\'s property showcase.',
      'Brokers and the sales team use it to show properties to buyers and to run the financing numbers with them.',
    ],
  },
  {
    slug: 'giya',
    role: 'Sole developer: my own product',
    brief: [
      'Food and retail customers in the Philippines already get a paper receipt when they buy. I wanted those receipts to earn them points they can turn into real rewards.',
      'Small food and retail businesses also want a loyalty programme. Giya had to give them one with no POS integration and no new hardware.',
    ],
    built: [
      'Giya is a PWA. A customer scans a printed receipt, earns points at partner businesses and redeems them for rewards. Sign-in is Google or Facebook only.',
      'When a customer scans a receipt, AI reads its details, then a fraud review checks it before any points are awarded. The points sit in a ledger. The fraud review and the ledger are partly live, and I am building the rest.',
      'Businesses get a module for their campaigns, points and customers, and an admin module sits behind both sides. The live version, Giya 2.0, is a rebuild of my first version. Giya is free for customers, and free for businesses during the pilot.',
    ],
    decisions: [
      {
        chose: 'Rebuilding as Giya 2.0',
        over: 'extending the first version',
        because: 'The product changed. The first version was a hyperlocal discovery and privileges app, and 2.0 focuses on receipt-scanning rewards and a CRM for businesses. The first version also began as a quick prototype, so 2.0 starts from a clean, maintainable codebase.',
      },
      {
        chose: 'Supabase',
        over: 'a custom backend',
        because: 'It gives me Postgres, sign-in and file storage for receipt images in one service, so I can ship fast as the only developer. Postgres row-level security also keeps customer, business and admin data apart.',
      },
      {
        chose: 'Google and Facebook sign-in only',
        over: 'email and password',
        because: 'Real social accounts make it harder to farm points with throwaway emails. One-tap sign-in also leaves no passwords to reset.',
      },
    ],
    stack: [
      { name: 'Next.js and React', why: 'Build the customer app and the business and admin modules.' },
      { name: 'Supabase', why: 'Holds the database, sign-in and receipt images, with row-level security between customers, businesses and admins.' },
      { name: 'Receipt OCR', why: 'Reads the details of each scanned receipt before the fraud review.' },
      { name: 'Tailwind CSS', why: 'Styles the app.' },
      { name: 'PWA', why: 'Makes Giya an installable app that runs in the browser.' },
      { name: 'Sentry', why: 'Reports errors from the live app.' },
    ],
    outcome: [
      'Giya 2.0 is live at giya.ph in a free pilot for customers and businesses. Paid tiers for businesses are planned.',
    ],
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug)
}

/** The case study that tells a project as part of its story, via `related`. */
export function caseStudyFor(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => (s.related ?? []).indexOf(slug) !== -1)
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
