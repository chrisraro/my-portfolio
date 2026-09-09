import { Project, Skill, SocialLink, ContactInfo, ExperienceItem, EducationItem, Recommendation, GalleryImage, Achievement } from '@/types'

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
    image: '/assets/images/projects/ocs-wp-control.png',
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
    featured: true,
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
    description: 'WooCommerce storefront and booking site for an El Nido tour operator, with a custom child theme covering product add-ons, invoice printing and PayPal payments.',
    band: 'Sites',
    image: '/assets/images/projects/elnido.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'PayPal'],
    links: { live: 'https://elnidoguide.ph' },
    status: 'live',
    dates: 'May – July 2025',
    featured: false,
  },
  {
    id: 'beachbus',
    slug: 'beachbus-palawan',
    title: 'BeachBus Palawan',
    description: 'Website and WooCommerce storefront for a Palawan shuttle operator, selling digital products with integrated payments.',
    band: 'Sites',
    image: '/assets/images/projects/beachbus.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'Payments'],
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
    description: 'Entrance-test review centre with nine branches across Luzon: programme tiers and class schedules per branch, plus online reservation with a downpayment through WooCommerce and PayMongo.',
    band: 'Sites',
    image: '/assets/images/projects/acad1.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'PayMongo'],
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
  { id: 'html5', name: 'HTML5', icon: 'html5', category: 'Frontend' },
  { id: 'css3', name: 'CSS3', icon: 'css3', category: 'Frontend' },
  { id: 'javascript', name: 'JavaScript', icon: 'javascript', category: 'Frontend' },
  { id: 'typescript', name: 'TypeScript', icon: 'typescript', category: 'Frontend' },
  { id: 'react', name: 'React', icon: 'react', category: 'Frontend' },
  { id: 'nextjs', name: 'Next.js', icon: 'nextjs', category: 'Frontend' },
  { id: 'tailwindcss', name: 'Tailwind CSS', icon: 'tailwindcss', category: 'Frontend' },
  { id: 'php', name: 'PHP', icon: 'php', category: 'Backend' },
  { id: 'nodejs', name: 'Node.js', icon: 'nodejs', category: 'Backend' },
  { id: 'java', name: 'Java', icon: 'java', category: 'Backend' },
  { id: 'postgresql', name: 'PostgreSQL', icon: 'postgresql', category: 'Backend' },
  { id: 'mysql', name: 'MySQL', icon: 'mysql', category: 'Backend' },
  { id: 'git', name: 'Git', icon: 'git', category: 'Tools & DevOps' },
  { id: 'github', name: 'GitHub', icon: 'github', category: 'Tools & DevOps' },
  { id: 'figma', name: 'Figma', icon: 'figma', category: 'Tools & DevOps' },
  { id: 'vscode', name: 'VS Code', icon: 'vscode', category: 'Tools & DevOps' },
  { id: 'wordpress', name: 'WordPress', icon: 'wordpress', category: 'Tools & DevOps' },
  { id: 'supabase', name: 'Supabase', icon: 'supabase', category: 'Backend' },
  { id: 'firebase', name: 'Firebase', icon: 'firebase', category: 'Backend' },
  { id: 'vercel', name: 'Vercel', icon: 'vercel', category: 'Tools & DevOps' },
  { id: 'render', name: 'Render', icon: 'render', category: 'Tools & DevOps' },
  { id: 'clerk', name: 'Clerk', icon: 'clerk', category: 'Tools & DevOps' },
  { id: 'coolify', name: 'Coolify', icon: 'coolify', category: 'Tools & DevOps' },
  { id: 'docker', name: 'Docker', icon: 'docker', category: 'Tools & DevOps' },
  { id: 'claude-code', name: 'Claude Code', icon: 'claudecode', category: 'Tools & DevOps' },
  { id: 'gemini-cli', name: 'Gemini CLI', icon: 'geminicli', category: 'Tools & DevOps' },
  { id: 'qoder', name: 'Qoder/Qwen', icon: 'qoder', category: 'Tools & DevOps' },
  { id: 'google-ai-studio', name: 'Google AI Studio', icon: 'googleaistudio', category: 'Tools & DevOps' },
  { id: 'woocommerce', name: 'WooCommerce', icon: 'woocommerce', category: 'Tools & DevOps' },
  { id: 'generatepress', name: 'GeneratePress', icon: 'generatepress', category: 'Tools & DevOps' },
  { id: 'generateblocks', name: 'GenerateBlocks', icon: 'generateblocks', category: 'Tools & DevOps' },
  { id: 'paypal', name: 'PayPal', icon: 'paypal', category: 'Tools & DevOps' },
  { id: 'maya', name: 'Maya', icon: 'maya', category: 'Tools & DevOps' },
  { id: 'xendit', name: 'Xendit', icon: 'xendit', category: 'Tools & DevOps' },
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

export const navigationItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Works', href: '#works' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export const recommendations: Recommendation[] = [
  {
    id: 1,
    quote: "Christian is an exceptional developer who brings both technical skill and creative vision to every project. His attention to detail and commitment to clean code is impressive.",
    authorName: "Alec Santos",
    authorTitle: "Project Manager, BeachBus Palawan"
  },
  {
    id: 2,
    quote: "Working with Christian was a great experience. He consistently delivered high-quality work on time and was always willing to go the extra mile to ensure project success.",
    authorName: "Brian Labilles",
    authorTitle: "Business Development Assistant, Enjoy Realty and Development Corporation"
  },
  {
    id: 3,
    quote: "Christian's expertise in frontend development and his eye for design made him an invaluable team member. He transformed our ideas into beautiful, functional interfaces.",
    authorName: "Bryden Elizan",
    authorTitle: "CEO/Founder, Online Creative Solutions"
  },
  {
    id: 4,
    quote: "I was impressed by Christian's ability to quickly learn new technologies and apply them effectively. His problem-solving skills and positive attitude make him a joy to work with.",
    authorName: "Joseph Cua",
    authorTitle: "CEO/Founder, Palawan Pick and Drop"
  }
];

export const galleryImages: GalleryImage[] = [
  { id: 1, src: "/assets/images/gallery/AmanWebAppPresentation.jpg", alt: "Presenting the Aman Group Web App at ERDC's Brokers Meeting" },
  { id: 2, src: "/assets/images/gallery/TeamBuildingWorkshopTagaytayEnjoyRealty.jpg", alt: "Team building workshop in Tagaytay with Enjoy Realty and Development Corporation" },
  { id: 3, src: "/assets/images/gallery/ElNidoSolo3.jpg", alt: "Solo trip to El Nido, sponsored by an agency client for whom I built an internal NFC Web App system" },
  { id: 4, src: "/assets/images/gallery/BeachBusatPort.jpg", alt: "BeachBus arriving at El Nido Port — I developed its website and internal NFC card system" },
  { id: 5, src: "/assets/images/gallery/InsideBeachBuswithBosses.jpg", alt: "Test ride aboard the BeachBus in El Nido" },
  { id: 6, src: "/assets/images/gallery/AtokwithJewel3.jpg", alt: "Exploring the Cordillera highlands with my partner, Jewel" }
];

export const achievements: Achievement[] = [
  {
    id: 1,
    title: "Software Engineer & Frontend Developer",
    description: "Building modern web experiences"
  },
  {
    id: 2,
    title: "B.S. Computer Science Graduate",
    link: "#experience"
  }
];
