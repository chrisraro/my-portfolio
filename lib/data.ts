import { Project, ProjectPlace, ProjectSector, Skill, SocialLink, ContactInfo, ExperienceItem, EducationItem, Recommendation, GalleryImage, NavigationItem, SECTOR_ORDER } from '@/types'
import { numberWord } from '@/lib/proof'

// The four gateways actually integrated across the WooCommerce projects. The
// hero proof band cites this count and a test enforces the match — an early
// draft of the design spec claimed five, and the review caught it.
export const paymentGateways: readonly string[] = [
  'PayPal',
  'PayMongo',
  'Maya',
  'Xendit',
]

// How the specialism line names each sector: plural, as a buyer would say it.
const sectorLabels: Record<ProjectSector, string> = {
  hotel: 'hotels',
  tours: 'tours',
  restaurant: 'restaurants',
  'review-centre': 'review centres',
  education: 'education',
  'real-estate': 'real estate',
  product: 'products',
  'internal-tool': 'internal tools',
  directory: 'directories',
}

// The first viewport names the verticals a hospitality owner is looking for.
// Every claim is checkable against the data below. No years-of-experience
// figure is claimed; the dated timeline carries that. The lede says "with
// online booking and payments where they need them" rather than "booking and
// payment websites": Graceland has neither, and the lede must not overclaim.
export const heroContent = {
  name: 'Christian Raro',
  // The trailhead (spec §6). The headline is three authored lines: each stays
  // one line in every font, so the font swap never re-wraps it (the R6 CLS
  // lesson). `title` below stays: metadata and JSON-LD read it until S5.
  eyebrow: 'Full-stack developer · Naga City, Philippines',
  headlineLines: ['Built in Bicol.', 'Running across', 'the Philippines.'],
  get headline(): string {
    return this.headlineLines.join(' ')
  },
  // A getter for the same reason as `specialism`: `projects` is declared below.
  // The count is the Products band, written as a word.
  get subheadline(): string {
    const own = projects.filter((p) => p.band === 'Products').length
    return `Booking and payment sites for travel businesses, AI automation for teams, and ${numberWord(own)} products of my own. Open to client projects and to full-time remote roles.`
  },
  title: 'Mid-level full-stack developer',
  location: 'Naga City',
  // Plain text under the title; the tools match the AI & automation skills.
  aiLine: 'AI-enabled engineer and automations: Claude Code, Codex, Qwen Code, n8n',
  // Proof for the AI line, from facts the site already holds: the chat
  // assistant (components/ui/chat-widget.tsx) runs on Groq (app/api/chat), and
  // the Connecta PH case study says it was built with AI coding help.
  aiProof: {
    lead: 'In use:',
    items: [
      { label: "Chunks, this site's assistant (Groq)" },
      { label: 'Connecta PH, built with AI coding help', href: '/projects/connecta-ph' },
    ] as { label: string; href?: string }[],
  },
  // The hero photo, described for the portrait's labelled button.
  portraitAlt: 'Portrait of Christian Raro hiking',
  lede: 'I build websites for hotels, tour operators and restaurants, with online booking and payments where they need them, plus products of my own.',
  // A getter, not a value: `projects` is declared further down this file, and
  // reading it eagerly here would hit the temporal dead zone at module load.
  // The count is the Sites band; the list is its distinct sectors in
  // hospitality-first order, capped at four so the line stays one line.
  get specialism(): string {
    const sites = projects.filter((p) => p.band === 'Sites' && p.status !== 'staging')
    const sectors = SECTOR_ORDER.filter((sector) => sites.some((p) => p.sector === sector))
      .slice(0, 4)
      .map((sector) => sectorLabels[sector])
    return `${sites.length} live sites · ${sectors.join(', ')}`
  },
  // Skill ids for the hero chips; tests/content/positioning.test.ts checks each exists.
  stack: ['nextjs', 'typescript', 'supabase', 'wordpress', 'woocommerce'],
  proofPoints: [
    'Four products of my own',
    'Nineteen projects shipped',
  ],
}

export const availability = 'Open to freelance and full-time roles'

export const resumeUrl = '/assets/resume/Raro, Christian F - Resume (DEV).pdf'

// Public city and region centres, two decimals (spec §5, the map data rule). A
// project is pinned only where its own title or description names the place;
// its `evidence` quotes those words and tests/content/places.test.ts checks
// them. Every other project is listed beside the map, never at a guessed point.
const NAGA_CITY: Omit<ProjectPlace, 'evidence'> = { name: 'Naga City', region: 'Camarines Sur', lat: 13.62, lng: 123.19, precision: 'city' }
const EL_NIDO: Omit<ProjectPlace, 'evidence'> = { name: 'El Nido', region: 'Palawan', lat: 11.2, lng: 119.42, precision: 'city' }
const PALAWAN: Omit<ProjectPlace, 'evidence'> = { name: 'Palawan', region: 'Philippines', lat: 9.84, lng: 118.74, precision: 'region' }
const BAGUIO_CITY: Omit<ProjectPlace, 'evidence'> = { name: 'Baguio City', region: 'Benguet', lat: 16.41, lng: 120.6, precision: 'city' }
const BORACAY: Omit<ProjectPlace, 'evidence'> = { name: 'Boracay', region: 'Aklan', lat: 11.97, lng: 121.92, precision: 'city' }
const BICOL: Omit<ProjectPlace, 'evidence'> = { name: 'Bicol', region: 'Philippines', lat: 13.4, lng: 123.4, precision: 'region' }

export const projects: Project[] = [
  // --- Products ------------------------------------------------------------
  {
    id: 'iskotify',
    slug: 'iskotify',
    title: 'Iskotify',
    description: 'Scholarship and exam-prep platform for Filipino students: scholarship tracking with deadline reminders, AI-generated flashcards with spaced repetition for UPCAT/ACET/DCAT, and an AI study companion, "Kuya Baw."',
    summary: 'Filipino students · scholarships, AI exam prep',
    band: 'Products',
    sector: 'product',
    image: '/assets/images/projects/iskotify.png',
    technologies: ['Next.js', 'React', 'Supabase', 'AI', 'PWA'],
    links: { live: 'https://iskotify.ph' },
    status: 'early-access',
    dates: 'June 2026',
    featured: true,
  },
  {
    id: 'naga-perks-giya-app',
    slug: 'giya',
    title: 'Giya',
    description: 'Receipt-scanning rewards app for Philippine food and retail: customers scan the receipts they already get, earn points at partner venues and redeem real rewards, with business and admin modules behind it.',
    summary: 'Food and retail · receipt-scanning rewards',
    band: 'Products',
    sector: 'product',
    image: '/assets/images/projects/naga-perks-giya-app.png',
    technologies: ['Next.js', 'Node.js', 'Tailwind CSS', 'Supabase', 'PWA'],
    links: { live: 'https://giya.ph' },
    status: 'live',
    featured: true,
  },
  {
    id: 'latag',
    slug: 'latag',
    title: 'Latag',
    description: 'Offline-first inventory and storefront tool for Philippine ukay-ukay resellers: catalogue every piece once, then share a single link buyers can browse. Free tier with a paid Pro storefront.',
    summary: 'Ukay-ukay resellers · inventory and storefront link',
    band: 'Products',
    sector: 'product',
    image: '/assets/images/projects/latag.png',
    technologies: ['Next.js', 'React', 'Tailwind CSS'],
    links: { live: 'https://latag.vercel.app' },
    status: 'live',
    featured: true,
  },
  {
    id: 'connecta-ph',
    slug: 'connecta-ph',
    title: 'Connecta PH',
    description: 'NFC and QR business cards that open a professional profile on any phone with no app to install, and send every visitor enquiry back to the card owner. Built for Naga first.',
    summary: 'Naga professionals · NFC cards, no app needed',
    sector: 'product',
    band: 'Products',
    image: '/assets/images/projects/connecta-ph.png',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Resend', 'Vercel', 'NFC'],
    links: { live: 'https://connectaph.vercel.app' },
    status: 'live',
    place: { ...NAGA_CITY, evidence: 'Built for Naga first' },
    featured: false,
  },

  // --- Custom systems --------------------------------------------------------
  {
    id: 'beachbus-nfc',
    slug: 'beachbus-nfc-card-system',
    title: 'BeachBus NFC Card System',
    description: 'Internal NFC card system built for BeachBus Palawan, the Palawan shuttle operator whose website I also built.',
    summary: 'Shuttle operator · internal NFC card system',
    band: 'Custom systems',
    sector: 'internal-tool',
    image: '',
    technologies: ['NFC'],
    links: {},
    status: 'internal',
    place: { ...PALAWAN, evidence: 'BeachBus Palawan' },
    featured: false,
  },
  {
    id: 'ocs-wp-control',
    slug: 'ocs-wp-control-panel',
    title: 'OCS WP Control Panel',
    description: 'Internal tool for Online Creative Solutions to manage, secure, and report on client WordPress sites from one dashboard.',
    summary: 'Internal · manage, secure and report on client sites',
    band: 'Custom systems',
    sector: 'internal-tool',
    image: '',
    technologies: ['Next.js', 'WordPress'],
    links: { live: 'https://ocs-wp-control.vercel.app' },
    status: 'auth-gated',
    featured: false,
  },

  // --- Applications --------------------------------------------------------
  {
    id: 'aman-webapp',
    slug: 'aman-group-web-app',
    title: 'Aman Group Web App',
    description: 'Full-stack Next.js app for a real estate company: a projects and properties showcase, and a loan calculator comparing Pag-IBIG, bank and in-house financing.',
    summary: 'Real estate · property showcase, loan calculator',
    band: 'Applications',
    sector: 'real-estate',
    image: '/assets/images/projects/aman-webapp.png',
    technologies: ['Next.js', 'React', 'Vercel', 'Upstash'],
    links: { live: 'https://amangroup-webapp.enjoyrealty.com' },
    status: 'live',
    dates: 'March – April 2025',
    featured: false,
  },
  {
    id: 'skimcare',
    slug: 'skimcare',
    title: 'SkimCare',
    description: "Team ESG's entry to the AppBuildersPH Hackathon 2026 (theme: Local AI), built with Glenn Viola. An Android and web app that reads an agreement you are about to sign, explains its key terms in plain English or Filipino, and links each one to the sentence it came from. Text recognition and a small language model run on the device, so nothing is uploaded.",
    summary: 'Filipino signers · on-device agreement reader',
    band: 'Applications',
    sector: 'product',
    image: '/assets/images/projects/skimcare.png',
    technologies: ['React Native', 'Expo', 'TypeScript', 'llama.cpp', 'ML Kit'],
    links: { live: 'https://skimcare-app.vercel.app', github: 'https://github.com/chrisraro/SkimCare' },
    status: 'live',
    dates: 'October 2026',
    featured: false,
  },

  {
    id: 'lunad',
    slug: 'lunad',
    title: 'Lunad',
    description: 'Mobile-first commuter web app (PWA) for Naga City: a jeepney trip planner with step-by-step guidance, saved trips, community tips and corrections, private driver reports and an admin review console. Unknown fares and routes are shown as unknown, never guessed. Pre-launch while reviewers check the route data.',
    summary: 'Naga commuters · jeepney trip planner',
    band: 'Applications',
    sector: 'product',
    image: '/assets/images/projects/lunad.png',
    technologies: ['Next.js', 'React', 'TypeScript', 'Neon Postgres', 'PostGIS', 'PWA', 'Playwright'],
    links: { live: 'https://para-naga.vercel.app', github: 'https://github.com/chrisraro/ParaNaga' },
    status: 'staging',
    place: { ...NAGA_CITY, evidence: 'Naga City' },
    dates: 'October 2026',
    featured: false,
  },
  // --- Sites ---------------------------------------------------------------
  {
    id: 'graceland',
    slug: 'graceland-bicolano-dining',
    title: 'Graceland Bicolano Dining',
    description: 'Website for a heritage Bicolano restaurant chain (est. 1976): menu showcase, branch locations, brand story, and promos.',
    summary: 'Restaurant · menu, branches, promos',
    band: 'Sites',
    sector: 'restaurant',
    image: '/assets/images/projects/graceland.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'SEO'],
    links: { live: 'https://graceland.ph' },
    status: 'live',
    place: { ...BICOL, evidence: 'Bicolano' },
    dates: 'May 2026',
    featured: true,
  },
  {
    id: 'elnido',
    slug: 'el-nido-guide-ph',
    title: 'El Nido Guide PH',
    description: 'Multi-operator booking marketplace for El Nido tours and activities, built on WooCommerce and Dokan so each operator runs its own store, with a custom child theme covering product add-ons, printable booking invoices, and PayPal and Maya payments.',
    summary: 'Tour operators · booking marketplace · PayPal, Maya',
    band: 'Sites',
    sector: 'tours',
    image: '/assets/images/projects/elnido.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'Dokan', 'PayPal', 'Maya'],
    links: { live: 'https://elnidoguide.ph' },
    status: 'live',
    place: { ...EL_NIDO, evidence: 'El Nido' },
    dates: 'May – July 2025',
    featured: true,
  },
  {
    id: 'beachbus',
    slug: 'beachbus-palawan',
    title: 'BeachBus Palawan',
    description: 'Website and WooCommerce storefront for a Palawan shuttle operator, selling digital products with integrated payments.',
    summary: 'Shuttle operator · storefront · PayPal, PayMongo, Maya',
    band: 'Sites',
    sector: 'tours',
    image: '/assets/images/projects/beachbus.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'PayPal', 'PayMongo', 'Maya'],
    links: { live: 'https://beachbus.ph' },
    status: 'live',
    place: { ...PALAWAN, evidence: 'Palawan' },
    dates: 'June – August 2025',
    featured: true,
  },
  {
    id: 'upcat-review-plus',
    slug: 'review-masters-bicol',
    title: 'Review Masters Bicol',
    description: 'Review centre website with online reservation powered by WooCommerce and an event entry system using QR codes.',
    summary: 'Review centre · online reservation, QR event entry',
    band: 'Sites',
    sector: 'review-centre',
    image: '/assets/images/projects/upcat-review-plus.png',
    technologies: ['WordPress', 'WooCommerce', 'QR Code', 'Online Reservation'],
    links: { live: 'https://upcatreviewplus.com' },
    status: 'live',
    place: { ...BICOL, evidence: 'Bicol' },
    featured: false,
  },
  {
    id: 'acad1',
    slug: 'acad1-review-center',
    title: 'ACAD1 Review Center',
    description: 'Entrance-test review centre with nine branches across Luzon: programme tiers and class schedules per branch, plus online reservation with a downpayment through WooCommerce and Xendit.',
    summary: 'Review centre · reservation with downpayment · Xendit',
    band: 'Sites',
    sector: 'review-centre',
    image: '/assets/images/projects/acad1.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'Xendit'],
    links: { live: 'https://acad1.ph' },
    status: 'live',
    dates: 'November – December 2024',
    featured: false,
  },
  {
    id: 'downtown-district-hotel',
    slug: 'downtown-district-hotel',
    title: 'Downtown District Hotel',
    description: 'Hotel website with room booking, amenities showcase, and contact management.',
    summary: 'Hotel · room booking, amenities',
    band: 'Sites',
    sector: 'hotel',
    image: '/assets/images/projects/downtown-district-hotel.png',
    technologies: ['WordPress', 'Booking System'],
    links: { live: 'https://downtowndistricthotel.ph' },
    status: 'ua-gated',
    featured: false,
  },
  {
    id: 'azalea-baguio',
    slug: 'azalea-baguio',
    title: 'Azalea Baguio',
    description: 'Production website for Azalea Hotels & Residences Baguio: rooms and serviced residences, amenities, and seasonal packages for the City of Pines property.',
    summary: 'Hotel · rooms, residences, packages',
    band: 'Sites',
    sector: 'hotel',
    image: '/assets/images/projects/azalea-baguio.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks'],
    links: { live: 'https://azaleabaguio.com' },
    status: 'live',
    place: { ...BAGUIO_CITY, evidence: 'Baguio' },
    featured: false,
  },
  {
    id: 'azalea-boracay',
    slug: 'azalea-boracay',
    title: 'Azalea Boracay',
    description: 'Production website for Azalea Hotels & Residences Boracay: hotel rooms and serviced holiday apartments a few steps from Station 2.',
    summary: 'Hotel · rooms and holiday apartments',
    band: 'Sites',
    sector: 'hotel',
    image: '/assets/images/projects/azalea-boracay.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks'],
    links: { live: 'https://azaleaboracay.com' },
    status: 'live',
    place: { ...BORACAY, evidence: 'Boracay' },
    featured: false,
  },
  {
    id: 'aralabroad',
    slug: 'aralabroad',
    title: 'AralAbroad',
    description: 'Independent study-abroad guidance for Filipino students: visa steps, real costs in pesos, scholarships, and reviews of the agencies themselves. Built for a site that deliberately is not an agency.',
    summary: 'Filipino students · study-abroad guidance',
    band: 'Sites',
    sector: 'education',
    image: '/assets/images/projects/aralabroad.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks'],
    links: { live: 'https://aralabroad.com' },
    status: 'ua-gated',
    featured: false,
  },
  {
    id: 'naga-city-guide',
    slug: 'naga-city-guide',
    title: 'Naga City Guide',
    description: 'A WordPress directory and blog for Naga City and Camarines Sur, with ten listing categories including hotels, restaurants, events and jobs, built on a custom theme and plug-in. Businesses can submit listings for free.',
    summary: 'Naga visitors and locals · city directory and blog',
    sector: 'directory',
    band: 'Sites',
    image: '/assets/images/projects/naga-city-guide.png',
    technologies: ['WordPress', 'Custom theme', 'Custom plug-in', 'CMB2', 'Google Maps', 'Yoast SEO'],
    links: { live: 'https://nagacityguide.com' },
    status: 'live',
    place: { ...NAGA_CITY, evidence: 'Naga City' },
    featured: false,
  },
  {
    id: 'eastwind-beach-villas',
    slug: 'eastwind-beach-villas',
    title: 'Eastwind Beach Villas',
    description: 'A WordPress site for eight beachfront villas on an east-facing cove in San Fernando, El Nido, Palawan, with direct booking through Cloudbeds.',
    summary: 'Villa guests · direct booking via Cloudbeds',
    band: 'Sites',
    sector: 'hotel',
    image: '/assets/images/projects/eastwind-beach-villas.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'Fluent Forms', 'Rank Math', 'Cloudbeds'],
    links: { live: 'https://eastwindbeachvillas.com' },
    status: 'live',
    place: { ...EL_NIDO, evidence: 'San Fernando, El Nido, Palawan' },
    featured: false,
  },
]

export const experience: ExperienceItem[] = [
  {
    id: 'ocs-webdev',
    title: 'Web Developer / AI Automation Specialist',
    company: 'Online Creative Solutions',
    dates: 'November 2024 – Present',
    location: 'Naga City, Camarines Sur',
    responsibilities: [
      'Build and maintain WordPress and WooCommerce sites for agency clients, including Azalea Baguio, Azalea Boracay, Graceland and Review Masters Bicol',
      'Built the OCS WP Control Panel, a Next.js and Supabase dashboard that manages client WordPress sites over MCP',
      'Built the Azalea e-Helpdesk, a hotel service-request desk shipped as a WordPress plugin with a PHP REST API and a React front end',
      'Set up and run the team’s self-hosted n8n automation stack for Google Workspace and LLM workflows',
      'Apply technical SEO and measurement briefs: redirect maps, JSON-LD schema, GA4 and Meta Pixel',
    ],
  },
  {
    id: 'enjoy-it',
    title: 'IT Staff / Web Developer',
    company: 'Enjoy Realty and Development Corporation',
    dates: 'March 2025 – August 2025',
    location: 'Naga City, Camarines Sur',
    concurrent: 'Full-time, concurrent with Online Creative Solutions',
    responsibilities: [
      'Developed full‑stack web applications',
      'Built and maintained WordPress sites',
      'Managed backend workflows and API integrations',
      'Graphic design support',
      'Hardware, network, and software maintenance',
    ],
  },
]

export const education: EducationItem[] = [
  {
    school: 'Bicol University Polangui Campus',
    degree: 'B.S. in Computer Science',
    dates: 'August 2020 – July 2024',
  },
]

// WordPress is the specialism, so it leads the stack as its own group.
export const skills: Skill[] = [
  { id: 'wordpress', name: 'WordPress', icon: 'wordpress', category: 'WordPress & e-commerce' },
  { id: 'woocommerce', name: 'WooCommerce', icon: 'woocommerce', category: 'WordPress & e-commerce' },
  { id: 'typescript', name: 'TypeScript', icon: 'typescript', category: 'Frontend' },
  { id: 'react', name: 'React', icon: 'react', category: 'Frontend' },
  { id: 'nextjs', name: 'Next.js', icon: 'nextjs', category: 'Frontend' },
  { id: 'tailwindcss', name: 'Tailwind CSS', icon: 'tailwindcss', category: 'Frontend' },
  { id: 'react-native', name: 'React Native / Expo', icon: 'react-native', category: 'Frontend' },
  { id: 'nodejs', name: 'Node.js', icon: 'nodejs', category: 'Backend' },
  { id: 'php', name: 'PHP', icon: 'php', category: 'Backend' },
  { id: 'postgresql', name: 'PostgreSQL', icon: 'postgresql', category: 'Backend' },
  { id: 'supabase', name: 'Supabase', icon: 'supabase', category: 'Backend' },
  { id: 'claude-code', name: 'Claude Code', icon: 'claude-code', category: 'AI & automation' },
  { id: 'codex', name: 'Codex', icon: 'codex', category: 'AI & automation' },
  { id: 'qwen-code', name: 'Qwen Code', icon: 'qwen-code', category: 'AI & automation' },
  { id: 'n8n', name: 'n8n', icon: 'n8n', category: 'AI & automation' },
  { id: 'groq-llm-apis', name: 'Groq / LLM APIs', icon: 'groq-llm-apis', category: 'AI & automation' },
  { id: 'docker', name: 'Docker', icon: 'docker', category: 'Tools & DevOps' },
  { id: 'vercel', name: 'Vercel', icon: 'vercel', category: 'Tools & DevOps' },
  { id: 'render', name: 'Render', icon: 'render', category: 'Tools & DevOps' },
  { id: 'git', name: 'Git', icon: 'git', category: 'Tools & DevOps' },
  { id: 'vitest-playwright', name: 'Vitest / Playwright', icon: 'vitest-playwright', category: 'Tools & DevOps' },
]

export const socialLinks: SocialLink[] = [
  { name: 'Facebook', url: 'https://www.facebook.com/chrisrarss?mibextid=ZbWKwL', icon: 'facebook' },
  { name: 'GitHub', url: 'https://github.com/chrisraro', icon: 'github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/christian-raro', icon: 'linkedin' },
  { name: 'Email', url: 'mailto:rarochristian029@gmail.com', icon: 'mail' },
]

export const contactInfo: ContactInfo = {
  email: 'rarochristian029@gmail.com',
  location: 'Naga City, Camarines Sur, Philippines',
  socialLinks,
}

// Labels a client understands. `#` targets are homepage sections; `/` targets
// are pages. tests/design/nav-anchors.test.ts checks both kinds resolve.
// Services, About and Hire join in S4, when their pages exist
// (tests/design/nav-anchors.test.ts checks every route has a page).
export const navigationItems: NavigationItem[] = [
  { label: 'Work', href: '/projects' },
  { label: 'Experience', href: '#timeline' },
  { label: 'Contact', href: '#contact' },
]

// The gateways as a sentence names them: "PayPal, PayMongo, Maya and Xendit".
const gatewaySentence = `${paymentGateways.slice(0, -1).join(', ')} and ${paymentGateways[paymentGateways.length - 1]}`

// Headings and copy for each homepage section. `galleryContent` waits for /about (S4).
export const sectionContent = {
  work: { eyebrow: 'Products', title: 'Products of my own' },
  systems: {
    eyebrow: 'Systems',
    title: 'Custom systems and client work',
    cta: 'Browse every project',
  },
  caseStudies: {
    eyebrow: 'Case studies',
    title: 'From the brief to launch',
  },
  timeline: {
    eyebrow: 'Elevation · the route so far',
    title: "Where I've worked",
    // The marker at now on the strip.
    here: 'You are here',
    // Labels for the spot heights; the numbers come from lib/elevation.ts.
    figures: {
      products: 'products of my own',
      shipped: 'projects shipped',
      caseStudies: 'case studies',
      places: 'places on the field map',
    },
  },
  // The two paths up from the trailhead (spec §5). Until S4 builds /services
  // and /hire, both lead to the contact form.
  fork: {
    eyebrow: 'The fork',
    title: 'Two ways up',
    business: {
      title: 'For your business',
      body: `Booking and payment sites for hotels, tours and restaurants, WooCommerce stores with ${gatewaySentence}, and AI automation for the work your team repeats.`,
      cta: 'Start a project',
    },
    team: {
      title: 'For your team',
      body: 'A full-stack developer for a full-time remote role: Next.js, TypeScript, Supabase and WordPress, with tests, CI and AI coding tools in daily use.',
      cta: 'Hire me for a role',
      resume: 'Download résumé',
    },
  },
  contact: { eyebrow: 'Contact', title: 'Start a project' },
}

// The footer's colophon, set as a small edge code.
export const footerContent = {
  colophon: 'Surveyed in Naga City',
  // The public locality only (CLAUDE.md privacy rule): Naga City's centre,
  // rounded to two decimals.
  base: { place: 'Naga City, Camarines Sur', coordinates: '13.62° N · 123.19° E' },
}

export const projectsPageContent = {
  eyebrow: 'All projects',
  // A filtered view (?band=) names its band instead.
  bandEyebrow: 'Projects · {band}',
  title: 'Everything I have shipped',
  description: 'Products of my own, custom systems, and client work, each with its live status.',
}

export const recommendations: Recommendation[] = [
  {
    id: 1,
    quote: "Christian is an exceptional developer who brings both technical skill and creative vision to every project. His attention to detail and commitment to clean code is impressive.",
    authorName: "Alec Santos",
    authorTitle: "Project Manager, BeachBus Palawan",
    projectId: 'beachbus',
  },
  {
    id: 2,
    quote: "Working with Christian was a great experience. He consistently delivered high-quality work on time and was always willing to go the extra mile to ensure project success.",
    authorName: "Brian Labilles",
    authorTitle: "Business Development Assistant, Enjoy Realty and Development Corporation",
    projectId: 'aman-webapp',
  },
  {
    id: 3,
    quote: "Christian's expertise in frontend development and his eye for design made him an invaluable team member. He transformed our ideas into beautiful, functional interfaces.",
    authorName: "Bryden Elizan",
    authorTitle: "CEO/Founder, Online Creative Solutions",
    projectId: 'ocs-wp-control',
  },
  {
    id: 4,
    quote: "I was impressed by Christian's ability to quickly learn new technologies and apply them effectively. His problem-solving skills and positive attitude make him a joy to work with.",
    authorName: "Joseph Cua",
    authorTitle: "CEO/Founder, Palawan Pick and Drop"
  }
];

// Retitled from "Gallery", then from "On-site delivery": three of the six
// photos are client work and three are the life around it, so the heading
// names both rather than overclaiming. Client-work photos lead.
export const galleryContent = {
  eyebrow: 'Field log',
  title: 'On site and on the road',
}

export const galleryImages: GalleryImage[] = [
  {
    id: 4,
    src: '/assets/images/gallery/BeachBusatPort.jpg',
    alt: 'A BeachBus vehicle arriving at a port',
    caption: 'BeachBus at El Nido Port. I built its website and its internal NFC card system',
  },
  {
    id: 1,
    src: '/assets/images/gallery/AmanWebAppPresentation.jpg',
    alt: 'Christian presenting to a seated audience at a brokers meeting',
    caption: "Presenting the Aman Group Web App at ERDC's brokers meeting",
  },
  {
    id: 5,
    src: '/assets/images/gallery/InsideBeachBuswithBosses.jpg',
    alt: 'Interior of the BeachBus with passengers seated',
    caption: 'Test ride aboard the BeachBus in El Nido',
  },
  {
    id: 2,
    src: '/assets/images/gallery/TeamBuildingWorkshopTagaytayEnjoyRealty.jpg',
    alt: 'Group photograph of the workshop team, seated and standing indoors',
    caption: 'Team building workshop in Tagaytay with Enjoy Realty and Development Corporation',
  },
  {
    id: 3,
    src: '/assets/images/gallery/ElNidoSolo3.jpg',
    alt: 'Christian on a beach in El Nido',
    caption: 'El Nido, sponsored by the client I built the internal NFC card system for',
  },
  {
    id: 6,
    src: '/assets/images/gallery/AtokwithJewel3.jpg',
    alt: 'Two people on a highland road in the Cordilleras',
    caption: 'Exploring the Cordillera highlands with my partner, Jewel',
  },
]

// Singular sector names for a project's own page ("Sites · tours").
export const sectorNames: Record<ProjectSector, string> = {
  hotel: 'hotel',
  tours: 'tours',
  restaurant: 'restaurant',
  'review-centre': 'review centre',
  education: 'education',
  'real-estate': 'real estate',
  product: 'product',
  'internal-tool': 'internal tool',
  directory: 'directory',
}

// Copy for /projects/[slug]. Flagships read as case studies; every other
// project gets a short page built only from its entry in `projects`.
export const caseStudyContent = {
  eyebrow: { caseStudy: 'Case study', project: 'Project' },
  headings: {
    brief: 'The brief',
    built: 'What I built',
    decisions: 'Decisions',
    stack: 'Stack',
    outcome: 'Outcome',
    client: 'From the client',
    about: 'About the project',
    next: 'Next case study',
    related: 'Related',
  },
  // A short page told inside a flagship's story links back to it.
  partOf: 'Part of the {title} case study',
  noPreview: {
    'auth-gated': 'This system sits behind a login, so there is no public preview.',
    internal: 'This is an internal system with no public screen to show.',
    fallback: 'No screenshot of this project yet.',
  },
}

// app/not-found.tsx: any unknown address, including an unknown /projects/<slug>.
export const notFoundContent = {
  eyebrow: '404',
  title: 'Nothing lives at this address',
  description: 'The link may be old or mistyped. Every project I have shipped is on the projects page.',
}

// What Christian offers. The chat prompt, the ProfessionalService structured
// data and /llms.txt all read this list, so it is stated once.
export const services: string[] = [
  'Full-stack web application development (Next.js, React, Node.js)',
  'WordPress website development and customisation',
  'E-commerce with WooCommerce and Philippine payment gateways',
  'Custom internal tools and hardware integrations',
  'API integrations',
  'AI automation with n8n, LLM APIs and retrieval (RAG)',
  'Mobile apps with React Native and Expo',
]
