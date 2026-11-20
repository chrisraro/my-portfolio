import { Project, ProjectPlace, ProjectSector, Skill, SocialLink, ContactInfo, ExperienceItem, EducationItem, Recommendation, GalleryImage, NavigationItem, SECTOR_ORDER } from '@/types'
import type { AboutPageContent, HirePageContent, ServiceArea, ServicePage, ServicesPageContent } from '@/types'
import { caseStudies } from '@/lib/case-studies'
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

// The first viewport's copy. Every claim is checkable against the data below.
// No years-of-experience figure is claimed; the dated timeline carries that.
export const heroContent = {
  name: 'Christian Raro',
  // The trailhead (spec §6). The headline is three authored lines: each stays
  // one line in every font, so the font swap never re-wraps it (the R6 CLS
  // lesson). `title` below is the Person's jobTitle in the JSON-LD.
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
  // The homepage's <title> (spec §6, titles table).
  pageTitle: 'Christian Raro · Full-Stack Developer in the Philippines',
  location: 'Naga City',
  // The hero photo: the trailhead's plate, and the Person's image in the JSON-LD.
  portrait: '/assets/images/about/profile-hiking.jpg',
  // The hero photo, described for the portrait's labelled button.
  portraitAlt: 'Portrait of Christian Raro hiking',
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
  { name: 'Facebook', url: 'https://www.facebook.com/chrisrarss', icon: 'facebook' },
  { name: 'GitHub', url: 'https://github.com/chrisraro', icon: 'github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/christian-raro', icon: 'linkedin' },
  { name: 'Email', url: 'mailto:rarochristian029@gmail.com', icon: 'mail' },
]

export const contactInfo: ContactInfo = {
  email: 'rarochristian029@gmail.com',
  location: 'Naga City, Camarines Sur, Philippines',
  socialLinks,
}

// Labels a client understands, in the spec's order (§3). `/` targets are
// pages; `#contact` is the homepage's form. tests/design/nav-anchors.test.ts
// checks both kinds resolve. The dated route lives on /about, so the legend no
// longer jumps to #timeline.
export const navigationItems: NavigationItem[] = [
  { label: 'Work', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Hire', href: '/hire' },
  { label: 'Contact', href: '#contact' },
]

// The gateways as a sentence names them: "PayPal, PayMongo, Maya and Xendit".
const gatewaySentence = `${paymentGateways.slice(0, -1).join(', ')} and ${paymentGateways[paymentGateways.length - 1]}`

// Call-to-action labels, each stated once (tests/content/cta-labels.test.ts).
// Every button, link and heading that says one reads it from here.
export const ctaLabels = {
  startProject: 'Start a project',
  hireForRole: 'Hire me for a role',
  allProjects: 'All projects',
  browseProjects: 'Browse every project',
  readCaseStudy: 'Read the case study',
  readMore: 'Read more',
  backHome: 'Back to the homepage',
  downloadResume: 'Download résumé',
  viewServices: 'See the services',
  allServices: 'All services',
} as const

// Headings and copy for each homepage section. `galleryContent` heads the photos on /about.
export const sectionContent = {
  ownProducts: { eyebrow: 'Own products', title: 'Products of my own' },
  fieldMap: {
    eyebrow: 'Field map',
    title: 'Where the work runs',
    caption: 'A pin sits only where a project’s own page names the place.',
    placesHeading: 'Places',
    regionNote: 'Pinned at the region’s centre',
    unplacedHeading: 'No fixed point',
    unplacedNote: 'These projects name no single place, so they are listed here rather than pinned.',
    cta: ctaLabels.browseProjects,
  },
  journals: { eyebrow: 'Trail journals', title: 'From the brief to launch' },
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
  // The two paths up from the trailhead (spec §5): a business to /services, a
  // hiring team to /hire.
  fork: {
    eyebrow: 'The fork',
    title: 'Two ways up',
    business: {
      title: 'For your business',
      body: `Booking and payment sites for hotels, tours and restaurants, WooCommerce stores with ${gatewaySentence}, and AI automation for the work your team repeats.`,
      cta: ctaLabels.viewServices,
    },
    team: {
      title: 'For your team',
      body: 'A full-stack developer for a full-time remote role: Next.js, TypeScript, Supabase and WordPress, with tests, CI and AI coding tools in daily use.',
      cta: ctaLabels.hireForRole,
      resume: ctaLabels.downloadResume,
    },
  },
  contact: {
    eyebrow: 'Plan the route',
    title: ctaLabels.startProject,
    lede: 'Tell me what you are building and when you need it. Hiring for a full-time role? Say so here too.',
    // The button that opens Chunks, the site's assistant.
    chunks: 'Ask Chunks, my site assistant',
  },
}

// The footer's colophon, set as a small edge code.
export const footerContent = {
  colophon: 'Surveyed in Naga City',
  // The public locality only (CLAUDE.md privacy rule): Naga City's centre,
  // rounded to two decimals.
  base: { place: 'Naga City, Camarines Sur', coordinates: '13.62° N · 123.19° E' },
}

export const projectsPageContent = {
  eyebrow: ctaLabels.allProjects,
  // A filtered view (?band=) names its band instead.
  bandEyebrow: 'Projects · {band}',
  title: 'Everything I have shipped',
  description: 'Products of my own, custom systems, and client work, each with its live status.',
  // Under the /projects map: how many of the projects shown have no pin.
  unpinned: 'Projects that name no single place are in the list only ({count} here).',
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

// app/not-found.tsx: any unknown address, including an unknown /projects/<slug>
// or /services/<slug>. Spec §5: "Off the trail".
export const notFoundContent = {
  eyebrow: '404 · Off the trail',
  title: 'Off the trail',
  description: 'Nothing lives at this address: the link may be old or mistyped. The way home starts here, and every project I have shipped is on the projects page.',
  here: sectionContent.timeline.here,
}

// What Christian offers. The chat prompt and /llms.txt read this list, so it
// is stated once.
export const services: string[] = [
  'Full-stack web application development (Next.js, React, Node.js)',
  'WordPress website development and customisation',
  'E-commerce with WooCommerce, PayPal and Philippine payment gateways',
  'Custom internal tools and hardware integrations',
  'API integrations',
  'AI automation with n8n, LLM APIs and retrieval (RAG)',
  'Mobile apps with React Native and Expo',
]

// Spec §6: the services serve Naga City, Bicol and the Philippines, and
// remote clients. Read by the Service nodes in lib/structured-data.ts.
export const serviceArea: ServiceArea = {
  city: 'Naga City',
  region: 'Bicol',
  country: 'Philippines',
  remote: 'Remote',
}

// --- S4 pages: /services, /about, /hire ---------------------------------------
// DRAFT COPY FOR CHRISTIAN'S REVIEW (S4 plan, Task 1). Every fact traces to
// this file, lib/case-studies.ts or the spec. The opening answers are third
// person and 40-60 words (spec §6, citability); the rest is first person.
// tests/content/new-pages.test.ts holds the counts, the keywords and every
// proving project to its own data.

/** When the copy on /services, /about and /hire was last checked; each page shows it. */
export const pagesUpdated = '2026-11-20'

const ownProductTitles = () => projects.filter((p) => p.band === 'Products').map((p) => p.title)
const listSentence = (items: string[]) => `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
const idsUsing = (technology: string) => projects.filter((p) => p.technologies.indexOf(technology) !== -1).map((p) => p.id)

// Who each gateway was chosen for, from the case studies' decisions (El Nido
// Guide PH and BeachBus Palawan for PayPal, PayMongo and Maya; ACAD1 for Xendit).
const gatewayUse: Record<string, string> = {
  PayPal: 'International travellers and tourists',
  PayMongo: 'Filipino riders paying by card or e-wallet',
  Maya: 'Filipino travellers paying by card or e-wallet',
  Xendit: 'The client’s existing merchant account',
}

export const servicePages: ServicePage[] = [
  {
    slug: 'full-stack-development',
    title: 'Full-Stack Web Developer (Next.js, React) · Philippines, remote',
    name: 'Full-stack development',
    summary: 'Web apps in Next.js, React, TypeScript and Supabase, from the first screen to the database.',
    keyword: 'full-stack developer Philippines',
    // Aman Group Web App (loan calculator), Giya (receipt rewards), Connecta PH (NFC cards, no app).
    answer:
      'Christian Raro is a full-stack developer in Naga City, Philippines, who builds web apps in Next.js, React, TypeScript and Supabase. He has built a real estate showcase with a loan calculator, a receipt-scanning rewards app and NFC business cards with no app to install, and is open to client projects and full-time remote roles.',
    sections: [
      {
        question: 'What do I build with Next.js and React?',
        answer: [
          // Project descriptions: aman-webapp, naga-perks-giya-app, lunad.
          'Web apps with screens a template cannot give. The Aman Group Web App compares Pag-IBIG, bank and in-house financing in a loan calculator. Giya turns scanned receipts into points at partner businesses. Lunad plans jeepney trips around Naga City, and is in pre-launch while reviewers check its route data.',
          // connecta-ph description.
          'Connecta PH opens a professional profile from an NFC or QR card on any phone, with no app to install, and sends every enquiry back to the card owner.',
        ],
      },
      {
        question: 'Which backend do I choose?',
        answer: [
          // Giya and Connecta PH decisions (Supabase); Aman decision (Upstash Redis, Vercel KV).
          'Supabase when an app needs Postgres, sign-in and file storage in one service, as Giya and Connecta PH do; its row-level security keeps Giya’s customer, business and admin data apart. Upstash Redis through Vercel KV when an app only stores small key-value data, as the Aman Group Web App does.',
          // lunad technologies.
          'Lunad runs on Neon Postgres with PostGIS.',
        ],
      },
      {
        question: 'How do I ship it?',
        answer: [
          // lunad technologies (Playwright); this repo's CI (.github/workflows/ci.yml).
          'In TypeScript, with tests and a pipeline. Lunad is tested with Playwright, and this portfolio runs type checks, lint, its tests and a production build on every push and pull request to main.',
        ],
      },
      {
        question: 'Do I build mobile apps too?',
        answer: [
          // skimcare description.
          'Yes. SkimCare, my team’s entry to the AppBuildersPH Hackathon 2026, built with Glenn Viola, is an Android and web app in React Native and Expo. It reads an agreement on the device and explains its key terms in plain English or Filipino.',
        ],
      },
    ],
    // The case studies' decisions: El Nido (WordPress over a custom app), Aman
    // (Next.js over WordPress; Upstash over Supabase), Giya and Connecta PH (Supabase).
    comparison: {
      caption: 'WordPress or a custom app: what I reach for',
      columns: ['When the job needs', 'I reach for', 'As on'],
      rows: [
        { need: 'Owners and staff editing pages, listings and bookings without a developer', choice: 'WordPress and WooCommerce', projectIds: ['elnido'] },
        { need: 'Custom interactive screens, such as a loan calculator', choice: 'A Next.js app', projectIds: ['aman-webapp'] },
        { need: 'Sign-in, a database and file storage, built fast by one developer', choice: 'Next.js with Supabase', projectIds: ['naga-perks-giya-app', 'connecta-ph'] },
        { need: 'Small key-value data such as listings, settings and leads', choice: 'Upstash Redis through Vercel KV', projectIds: ['aman-webapp'] },
      ],
    },
    projectIds: ['aman-webapp', 'naga-perks-giya-app', 'connecta-ph', 'lunad', 'skimcare'],
  },
  {
    slug: 'wordpress-woocommerce',
    title: 'WordPress & WooCommerce Developer · PayMongo, Maya, Xendit, PayPal',
    name: 'WordPress and WooCommerce',
    summary: `WordPress sites for hotels, tours and review centres, and WooCommerce checkout through ${gatewaySentence}.`,
    keyword: 'WordPress and WooCommerce developer',
    // Sites band sectors; paymentGateways; El Nido and BeachBus outcomes ("I still maintain").
    answer: `Christian Raro is a WordPress and WooCommerce developer in Naga City, Philippines. He builds sites for hotels, tour operators, review centres and restaurants, and WooCommerce booking and checkout with ${gatewaySentence}, the gateways Filipino buyers and international travellers pay with. He built and still maintains El Nido Guide PH and BeachBus Palawan.`,
    sections: [
      {
        question: 'What kinds of WordPress sites do I build?',
        answer: [
          // Sites band entries and their technologies.
          'Sites for hotels, tour operators, review centres, restaurants and directories, among them Azalea Baguio, Azalea Boracay, Graceland Bicolano Dining, Review Masters Bicol and Naga City Guide. Most run on GeneratePress and GenerateBlocks; Naga City Guide runs on a custom theme and plug-in.',
        ],
      },
      {
        question: 'Which payment gateways have I integrated?',
        answer: [
          // El Nido, BeachBus and ACAD1 decisions.
          `${gatewaySentence}, each through WooCommerce. PayPal serves international travellers, PayMongo and Maya serve Filipino buyers who pay by card or e-wallet, and Xendit went in where the client already had a merchant account.`,
        ],
      },
      {
        question: 'Can a WooCommerce site take bookings and deposits?',
        answer: [
          // El Nido and ACAD1 case studies.
          'Yes. El Nido Guide PH is a booking marketplace on WooCommerce and Dokan where each tour operator runs its own store and every booking pays the operator directly. ACAD1 Review Center reserves a slot with a 50% downpayment through Xendit, and the student settles the balance before the first session.',
          // BeachBus case study (online pass sales are paused, so nothing here says they sell online).
          'BeachBus Palawan’s storefront lists 1, 3 and 5 day passes and monthly passes, and local Partner Hubs sell or redeem them for a commission.',
        ],
      },
      {
        question: 'Who runs the site after launch?',
        answer: [
          // El Nido decision; El Nido and BeachBus outcomes.
          'The client does: WordPress and WooCommerce let owners, staff and operators edit pages, listings and prices without a developer. I still maintain El Nido Guide PH and BeachBus Palawan.',
        ],
      },
    ],
    comparison: {
      caption: 'The payment gateways I have integrated',
      columns: ['Gateway', 'Chosen for', 'Used on'],
      rows: paymentGateways.map((g) => ({ need: g, choice: gatewayUse[g], projectIds: idsUsing(g) })),
    },
    projectIds: ['elnido', 'beachbus', 'acad1', 'upcat-review-plus', 'azalea-baguio', 'azalea-boracay', 'graceland', 'naga-city-guide'],
  },
  {
    slug: 'ai-automation',
    title: 'AI Automation Engineer · n8n, LLM workflows, MCP',
    name: 'AI automation',
    summary: 'n8n workflows, LLM features inside products, and tooling over MCP.',
    keyword: 'AI automation engineer',
    // experience: ocs-webdev (title, n8n stack, the control panel over MCP).
    answer:
      'Christian Raro is an AI automation engineer in Naga City, Philippines, working as Web Developer and AI Automation Specialist at Online Creative Solutions. He set up and runs the team’s self-hosted n8n stack for Google Workspace and LLM workflows, built a dashboard that manages client WordPress sites over MCP, and ships AI features in his own products.',
    sections: [
      {
        question: 'What do I automate?',
        answer: [
          // experience: ocs-webdev responsibilities.
          'At Online Creative Solutions I set up and run the team’s self-hosted n8n automation stack for Google Workspace and LLM workflows. I also built the OCS WP Control Panel, a Next.js and Supabase dashboard that manages client WordPress sites over MCP.',
        ],
      },
      {
        question: 'Where do I put LLMs in a product?',
        answer: [
          // iskotify description; Giya case study (AI reads the receipt, then the fraud review); Chunks on Groq.
          'Iskotify generates exam-prep flashcards with AI and has an AI study companion, Kuya Baw. Giya uses AI to read a scanned receipt, then a fraud review, partly live, checks it. Chunks, this site’s assistant, answers questions about my work through Groq.',
        ],
      },
      {
        question: 'Can AI run without the cloud?',
        answer: [
          // skimcare description.
          'Yes. SkimCare runs text recognition and a small language model on the phone, so the agreement a person is about to sign is never uploaded.',
        ],
      },
      {
        question: 'Which AI tools do I build with?',
        answer: [
          // skills: AI & automation.
          'Claude Code, Codex and Qwen Code for writing code, n8n for workflows, and Groq and other LLM APIs inside products.',
        ],
      },
    ],
    projectIds: ['ocs-wp-control', 'iskotify', 'naga-perks-giya-app', 'skimcare'],
  },
]

export const servicesPageContent: ServicesPageContent = {
  title: 'Services · Christian Raro',
  eyebrow: 'Services',
  heading: 'What I build',
  get answer(): string {
    return `Christian Raro is a full-stack developer in Naga City, Philippines, offering ${numberWord(servicePages.length)} services: full-stack web apps in Next.js and React, WordPress and WooCommerce sites with PayPal and Philippine payment gateways, and AI automation with n8n, LLM APIs and MCP. Each service lists the projects that prove it, and each page ends in a contact form.`
  },
  proof: { eyebrow: 'Proof', title: 'Projects that prove it' },
}

export const aboutPageContent: AboutPageContent = {
  title: 'About Christian Raro · Web Developer in Naga City, Bicol',
  eyebrow: 'About',
  heading: 'Based in Naga City',
  keyword: 'web developer Naga City Bicol',
  // education, experience (ocs-webdev start), the hero subheadline's claims.
  get answer(): string {
    return `Christian Raro is a web developer in Naga City, Camarines Sur, in the Bicol region of the Philippines. He studied computer science at Bicol University, has worked at Online Creative Solutions since November 2024, and builds booking and payment sites for travel businesses, AI automation for teams and ${numberWord(ownProductTitles().length)} products of his own.`
  },
  story: {
    eyebrow: 'Story',
    title: 'Built in Bicol',
    get paragraphs(): string[] {
      return [
        // education; experience: ocs-webdev.
        'I studied computer science at Bicol University Polangui Campus from 2020 to 2024. That November I joined Online Creative Solutions in Naga City as a web developer, and I still build and maintain WordPress and WooCommerce sites for its clients and run the team’s n8n automation there.',
        // experience: enjoy-it; Aman case study outcome.
        'From March to August 2025 I also worked full-time as IT staff and web developer at Enjoy Realty and Development Corporation. There I built the Aman Group Web App and presented it at the company’s brokers’ meeting.',
        // places on the field map; the Products band; Connecta PH description.
        `Much of the client work runs far from Naga: tour bookings in El Nido, a beach shuttle in El Nido, hotels in Baguio and Boracay. Closer to home I build products of my own: ${listSentence(ownProductTitles())}. Connecta PH launches in Naga first.`,
      ]
    },
  },
  timeline: { eyebrow: 'Route', title: sectionContent.timeline.title },
  testimonials: { eyebrow: 'From the field', title: 'What clients and colleagues say' },
}

export const hirePageContent: HirePageContent = {
  title: 'Hire a Mid-Level Full-Stack Developer · Remote, Philippines',
  eyebrow: 'Hire',
  heading: ctaLabels.hireForRole,
  keyword: 'mid-level full-stack developer remote',
  // heroContent.title, the fork's team body, the elevation strip's counts.
  get answer(): string {
    const shipped = projects.filter((p) => p.status !== 'staging').length
    return `Christian Raro is a mid-level full-stack developer in Naga City, Philippines, open to full-time remote roles. He works in Next.js, TypeScript, Supabase and WordPress, with tests, CI and AI coding tools in daily use, and has shipped ${numberWord(shipped)} projects, ${numberWord(ownProductTitles().length)} of them his own products, with ${numberWord(caseStudies.length)} written up as case studies.`
  },
  facts: { title: 'At a glance', labels: { availability: 'Availability', base: 'Base', code: 'Code' } },
  stack: {
    eyebrow: 'Stack',
    title: 'Stack, by depth',
    coreLabel: 'Core',
    coreNote: 'Each one runs in projects on this site.',
    // Moved from heroContent.stack (S4).
    coreIds: ['nextjs', 'typescript', 'supabase', 'wordpress', 'woocommerce'],
    moreLabel: 'Also in use',
  },
  howIWork: {
    eyebrow: 'Practice',
    title: 'How I work',
    get notes() {
      return [
        // this repo's CI; lunad technologies.
        { title: 'Tests and CI', body: 'This portfolio runs type checks, lint, its tests and a production build on every push and pull request to main. Lunad is tested with Playwright.' },
        // skills: AI & automation; the fork's team body ("in daily use"); experience: n8n.
        { title: 'AI coding tools', body: 'Claude Code, Codex and Qwen Code are in daily use. At Online Creative Solutions I also run the team’s n8n automation stack.' },
        // every case study's role; El Nido and BeachBus outcomes.
        { title: 'Brief to launch', body: `I was the sole developer on all ${numberWord(caseStudies.length)} case studies, from the brief onward, and I still maintain El Nido Guide PH and BeachBus Palawan.` },
      ]
    },
    aiLead: 'In use:',
    // Moved from heroContent.aiProof (S4): Chunks runs on Groq (app/api/chat);
    // the Connecta PH case study says it was built with AI coding help.
    aiInUse: [
      { label: 'Chunks, this site’s assistant (Groq)' },
      { label: 'Connecta PH, built with AI coding help', href: '/projects/connecta-ph' },
    ],
  },
  history: { eyebrow: 'Route', title: 'Work history' },
}
