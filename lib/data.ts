import { Project, Skill, SocialLink, ContactInfo, ExperienceItem, EducationItem, Recommendation, GalleryImage, NavigationItem } from '@/types'

// The four gateways actually integrated across the WooCommerce projects. The
// hero proof band cites this count and a test enforces the match — an early
// draft of the design spec claimed five, and the review caught it.
export const paymentGateways: readonly string[] = [
  'PayPal',
  'PayMongo',
  'Maya',
  'Xendit',
]

// Positioning stays broad, so the entire differentiation burden sits on these
// claims. Every one is checkable against the data below. No years-of-experience
// figure is claimed; the dated timeline carries that.
export const heroContent = {
  name: 'Christian Raro',
  title: 'Full-stack developer',
  location: 'Naga City',
  lede: 'I build products, WordPress platforms, and the systems between them — from Naga City, for clients anywhere.',
  // A getter, not a value: `projects` is declared further down this file, and
  // reading it eagerly here would hit the temporal dead zone at module load.
  get specialism(): string {
    const sites = projects.filter((p) => p.band === 'Sites').length
    return `WordPress specialist · ${sites} production sites · WooCommerce`
  },
  // Skill ids for the hero chips; tests/content/positioning.test.ts checks each exists.
  stack: ['nextjs', 'typescript', 'supabase', 'wordpress', 'woocommerce'],
  proofPoints: [
    'Three products of my own',
    'Fifteen projects shipped',
    'Four payment gateways',
    'One NFC card system',
  ],
}

export const availability = 'Open to freelance and full-time roles'

export const resumeUrl = '/assets/resume/Raro, Christian F - Resume (DEV).pdf'

export const projects: Project[] = [
  // --- Products ------------------------------------------------------------
  {
    id: 'iskotify',
    slug: 'iskotify',
    title: 'Iskotify',
    description: 'Scholarship and exam-prep platform for Filipino students: scholarship tracking with deadline reminders, AI-generated flashcards with spaced repetition for UPCAT/ACET/DCAT, and an AI study companion, "Kuya Baw."',
    band: 'Products',
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
    band: 'Products',
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
    band: 'Products',
    image: '/assets/images/projects/latag.png',
    technologies: ['Next.js', 'React', 'Tailwind CSS'],
    links: { live: 'https://latag.vercel.app' },
    status: 'live',
    featured: true,
  },

  // --- Custom systems --------------------------------------------------------
  {
    id: 'beachbus-nfc',
    slug: 'beachbus-nfc-card-system',
    title: 'BeachBus NFC Card System',
    description: 'Internal NFC card system built for BeachBus Palawan, the Palawan shuttle operator whose website I also built.',
    band: 'Custom systems',
    image: '',
    technologies: ['NFC'],
    links: {},
    status: 'internal',
    featured: false,
  },
  {
    id: 'ocs-wp-control',
    slug: 'ocs-wp-control-panel',
    title: 'OCS WP Control Panel',
    description: 'Internal tool for Online Creative Solutions to manage, secure, and report on client WordPress sites from one dashboard.',
    band: 'Custom systems',
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
    description: 'Full-stack Next.js app for a real estate company: projects and properties showcase, visit scheduling, loan calculator, and broker referral links.',
    band: 'Applications',
    image: '/assets/images/projects/aman-webapp.png',
    technologies: ['Next.js', 'React', 'Vercel', 'Supabase', 'Upstash'],
    links: { live: 'https://amangroup-webapp.enjoyrealty.com' },
    status: 'live',
    dates: 'March – April 2025',
    featured: false,
  },

  // --- Sites ---------------------------------------------------------------
  {
    id: 'graceland',
    slug: 'graceland-bicolano-dining',
    title: 'Graceland Bicolano Dining',
    description: 'Website for a heritage Bicolano restaurant chain (est. 1976): menu showcase, branch locations, brand story, and promos.',
    band: 'Sites',
    image: '/assets/images/projects/graceland.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'SEO'],
    links: { live: 'https://graceland.ph' },
    status: 'live',
    dates: 'May 2026',
    featured: true,
  },
  {
    id: 'elnido',
    slug: 'el-nido-guide-ph',
    title: 'El Nido Guide PH',
    description: 'WooCommerce storefront and booking site for an El Nido tour operator, with a custom child theme covering product add-ons, invoice printing, and PayPal and PayMongo payments.',
    band: 'Sites',
    image: '/assets/images/projects/elnido.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'PayPal', 'PayMongo'],
    links: { live: 'https://elnidoguide.ph' },
    status: 'live',
    dates: 'May – July 2025',
    featured: true,
  },
  {
    id: 'beachbus',
    slug: 'beachbus-palawan',
    title: 'BeachBus Palawan',
    description: 'Website and WooCommerce storefront for a Palawan shuttle operator, selling digital products with integrated payments.',
    band: 'Sites',
    image: '/assets/images/projects/beachbus.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'PayPal', 'PayMongo', 'Maya'],
    links: { live: 'https://beachbus.ph' },
    status: 'live',
    dates: 'June – August 2025',
    featured: true,
  },
  {
    id: 'upcat-review-plus',
    slug: 'review-masters-bicol',
    title: 'Review Masters Bicol',
    description: 'Review centre website with online reservation powered by WooCommerce and an event entry system using QR codes.',
    band: 'Sites',
    image: '/assets/images/projects/upcat-review-plus.png',
    technologies: ['WordPress', 'WooCommerce', 'QR Code', 'Online Reservation'],
    links: { live: 'https://upcatreviewplus.com' },
    status: 'live',
    featured: false,
  },
  {
    id: 'acad1',
    slug: 'acad1-review-center',
    title: 'ACAD1 Review Center',
    description: 'Entrance-test review centre with nine branches across Luzon: programme tiers and class schedules per branch, plus online reservation with a downpayment through WooCommerce and Xendit.',
    band: 'Sites',
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
    band: 'Sites',
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
    band: 'Sites',
    image: '/assets/images/projects/azalea-baguio.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks'],
    links: { live: 'https://azaleabaguio.com' },
    status: 'live',
    featured: false,
  },
  {
    id: 'azalea-boracay',
    slug: 'azalea-boracay',
    title: 'Azalea Boracay',
    description: 'Production website for Azalea Hotels & Residences Boracay: hotel rooms and serviced holiday apartments a few steps from Station 2.',
    band: 'Sites',
    image: '/assets/images/projects/azalea-boracay.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks'],
    links: { live: 'https://azaleaboracay.com' },
    status: 'live',
    featured: false,
  },
  {
    id: 'aralabroad',
    slug: 'aralabroad',
    title: 'AralAbroad',
    description: 'Independent study-abroad guidance for Filipino students — visa steps, real costs in pesos, scholarships, and reviews of the agencies themselves — built for a site that deliberately is not an agency.',
    band: 'Sites',
    image: '/assets/images/projects/aralabroad.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks'],
    links: { live: 'https://aralabroad.com' },
    status: 'ua-gated',
    featured: false,
  },
]

export const experience: ExperienceItem[] = [
  {
    id: 'ocs-webdev',
    title: 'Web Developer',
    company: 'Online Creative Solutions',
    dates: 'November 2024 – Present',
    location: 'Naga City, Camarines Sur',
    responsibilities: [
      'Developed full‑stack web applications',
      'Built WordPress sites with custom themes',
      'Maintained backend workflows and API integrations',
      'Contributed to UI/UX design',
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

export const skills: Skill[] = [
  { id: 'typescript', name: 'TypeScript', icon: 'typescript', category: 'Frontend' },
  { id: 'react', name: 'React', icon: 'react', category: 'Frontend' },
  { id: 'nextjs', name: 'Next.js', icon: 'nextjs', category: 'Frontend' },
  { id: 'tailwindcss', name: 'Tailwind CSS', icon: 'tailwindcss', category: 'Frontend' },
  { id: 'nodejs', name: 'Node.js', icon: 'nodejs', category: 'Backend' },
  { id: 'php', name: 'PHP', icon: 'php', category: 'Backend' },
  { id: 'postgresql', name: 'PostgreSQL', icon: 'postgresql', category: 'Backend' },
  { id: 'supabase', name: 'Supabase', icon: 'supabase', category: 'Backend' },
  { id: 'wordpress', name: 'WordPress', icon: 'wordpress', category: 'Tools & DevOps' },
  { id: 'woocommerce', name: 'WooCommerce', icon: 'woocommerce', category: 'Tools & DevOps' },
  { id: 'docker', name: 'Docker', icon: 'docker', category: 'Tools & DevOps' },
  { id: 'vercel', name: 'Vercel', icon: 'vercel', category: 'Tools & DevOps' },
  { id: 'git', name: 'Git', icon: 'git', category: 'Tools & DevOps' },
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

export const navigationItems: NavigationItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'Changelog', href: '#changelog' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
]

// Headings for each homepage section. The Field log uses `galleryContent`.
export const sectionContent = {
  work: { eyebrow: '// products', title: 'Products of my own' },
  systems: {
    eyebrow: '// systems',
    title: 'Custom systems and client work',
    cta: 'Browse every project',
  },
  changelog: { eyebrow: '// changelog', title: "Where I've worked" },
  stack: { eyebrow: '// stack', title: 'What I ship with' },
  contact: { eyebrow: '// contact', title: 'Start a project' },
}

export const projectsPageContent = {
  eyebrow: '// all projects',
  title: 'Everything I have shipped',
  description: 'Products of my own, custom systems, and client work — each with its live status.',
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

// Retitled from "Gallery". These six photographs carry the most specific,
// least reproducible content on the site; naming the section for what it shows
// is the difference between decoration and proof.
export const galleryContent = {
  eyebrow: '// working with clients',
  title: 'On-site delivery',
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: '/assets/images/gallery/AmanWebAppPresentation.jpg',
    alt: 'Christian presenting to a seated audience at a brokers meeting',
    caption: "Presenting the Aman Group Web App at ERDC's brokers meeting",
  },
  {
    id: 2,
    src: '/assets/images/gallery/TeamBuildingWorkshopTagaytayEnjoyRealty.jpg',
    alt: 'Group photograph at an outdoor team workshop',
    caption: 'Team building workshop in Tagaytay with Enjoy Realty and Development Corporation',
  },
  {
    id: 3,
    src: '/assets/images/gallery/ElNidoSolo3.jpg',
    alt: 'Christian on a beach in El Nido',
    caption: 'El Nido, sponsored by the client I built the internal NFC card system for',
  },
  {
    id: 4,
    src: '/assets/images/gallery/BeachBusatPort.jpg',
    alt: 'A BeachBus vehicle arriving at a port',
    caption: 'BeachBus at El Nido Port — I built its website and its internal NFC card system',
  },
  {
    id: 5,
    src: '/assets/images/gallery/InsideBeachBuswithBosses.jpg',
    alt: 'Interior of the BeachBus with passengers seated',
    caption: 'Test ride aboard the BeachBus in El Nido',
  },
  {
    id: 6,
    src: '/assets/images/gallery/AtokwithJewel3.jpg',
    alt: 'Two people on a highland road in the Cordilleras',
    caption: 'Exploring the Cordillera highlands with my partner, Jewel',
  },
]
