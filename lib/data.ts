import { Project, Skill, SocialLink, ContactInfo, ExperienceItem, EducationItem } from '@/types'

export const projects: Project[] = [
  {
    id: 'online-creative-solutions',
    title: 'Online Creative Solutions',
    description: 'Online Marketing Agency Website with modern design and marketing tools integration.',
    category: 'WordPress Development',
    image: '/assets/images/projects/onlinecreativesolutions.webp',
    technologies: ['WordPress', 'Marketing', 'SEO', 'Digital Marketing'],
    links: { live: 'https://onlinecreativesolutions.com' },
  },
  {
    id: 'fish2go',
    title: 'Fish2Go',
    description: 'WooCommerce WordPress website for seafood delivery service with online ordering and payment integration.',
    category: 'WordPress + WooCommerce',
    image: '/assets/images/projects/fish2go.webp',
    technologies: ['WordPress', 'WooCommerce', 'Payments', 'Online Ordering'],
    links: { live: 'https://onlinecreativesolutions.com/fish2go' },
  },
  {
    id: 'azalea-main',
    title: 'Azalea Main',
    description: 'Hotel website with booking system, room showcase, and online reservation capabilities.',
    category: 'Hotel Website',
    image: '/assets/images/projects/azaleamain.webp',
    technologies: ['WordPress', 'Booking System', 'Hotel Management'],
    links: { live: 'https://kurokuroko.com/azaleamain/' },
  },
  {
    id: 'downtown-district-hotel',
    title: 'Downtown District Hotel',
    description: 'Modern hotel website with room booking, amenities showcase, and contact management.',
    category: 'Hotel Website',
    image: '/assets/images/projects/downtowndistricthotel.webp',
    technologies: ['WordPress', 'Booking System', 'Hotel Management'],
    links: { live: 'https://downtowndistricthotel.ph' },
  },
  {
    id: 'elnido',
    title: 'El Nido Guide PH',
    description: 'WordPress site using GeneratePress Premium and GenerateBlocks Pro. Custom child theme code for booking, product add-ons, invoice printing, PayPal payments, and WooCommerce storefront.',
    category: 'WordPress Development',
    image: '/assets/images/projects/elnidoguide.webp',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'PayPal'],
    links: { live: 'https://elnidoguide.ph' },
  },
  {
    id: 'beachbus',
    title: 'BeachBus Palawan',
    description: 'WordPress site with GeneratePress Premium + GenerateBlocks Pro, WooCommerce storefront for digital products, and payment integration.',
    category: 'WordPress Development',
    image: '/assets/images/projects/beachbus.webp',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'Payments'],
    links: { live: 'https://beachbus.ph' },
  },
  {
    id: 'aman-webapp',
    title: 'Aman Group of Companies Web App',
    description: "Full-stack Next.js app for a real estate company: projects/properties showcase, visit scheduling, loan calculator, and broker referral links. Leveraged Vercel, Supabase, Upstash.",
    category: 'Full-Stack Web App',
    image: '/assets/images/projects/amangroupofcompanies.webp',
    technologies: ['Next.js', 'React', 'Vercel', 'Supabase', 'Upstash'],
    links: { live: 'https://amangroup-webapp.enjoyrealty.com' },
  },
  // {
  //   id: 'enjoy-realty',
  //   title: 'Enjoy Realty Corporate Website',
  //   description: 'Redesign from Elementor to GeneratePress + GenerateBlocks Pro with dynamic pages and improved navigation/routing.',
  //   category: 'WordPress Redesign',
  //   image: '/assets/images/projects/enjoyrealty.com_.png',
  //   technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks'],
  //   links: { live: 'https://enjoyrealty.com' },
  // },
  {
    id: 'acad1',
    title: 'Acad1 Review Center',
    description: 'WordPress site with WooCommerce integration, PayMongo payments, and custom theme work using GeneratePress Premium + GenerateBlocks Pro.',
    category: 'WordPress + WooCommerce',
    image: '/assets/images/projects/acad1.webp',
    technologies: ['WordPress', 'WooCommerce', 'GeneratePress', 'GenerateBlocks', 'PayMongo'],
    links: { live: 'https://acad1.ph' },
  },
  {
    id: 'muramart',
    title: 'Muramart App',
    description: 'Full-stack Bubble.io web and mobile app with UI/UX design and backend workflow + API maintenance.',
    category: 'Bubble.io App',
    image: '/assets/images/projects/muramart.webp',
    technologies: ['Bubble.io', 'Mobile', 'API'],
    links: { live: 'https://muramartv2.com', playStore: 'https://play.google.com/store/apps/details?id=com.wnapp.id1705363159277' },
  },
  {
    id: 'arway',
    title: 'ARWay (CampusNav)',
    description: 'AR navigation app for thesis using Flutter and ARWay; integrated plugins for immersive experience.',
    category: 'AR Mobile Application',
    image: '/assets/images/projects/ARway Screenshot.jpg',
    technologies: ['Flutter', 'ARWay', 'Unity'],
    links: {},
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
    responsibilities: [
      'Developed full‑stack web applications',
      'Built and maintained WordPress sites',
      'Managed backend workflows and API integrations',
      'Graphic design support',
      'Hardware, network, and software maintenance',
    ],
  },
  {
    id: 'muramart-bubble',
    title: 'Junior/Assistant Bubble.io Developer',
    company: 'Muramart Holdings Inc.',
    dates: 'August 2023 – September 2024',
    location: 'Naga City, Camarines Sur',
    responsibilities: [
      'Developed full‑stack web and mobile apps using Bubble.io',
      'Designed UI/UX and translated to production apps',
      'Maintained backend workflows and API integrations',
    ],
  },
  {
    id: 'muramart-ojt',
    title: 'On-the-Job Training (240 hrs.)',
    company: 'Muramart Holdings Inc.',
    dates: 'July 2023 – August 2023',
    location: 'Naga City, Camarines Sur',
    responsibilities: [
      'Introduced to Bubble.io development platform',
      'Participated in workshops and seminars',
      'Hands‑on development on assigned projects',
    ],
  },
]

export const education: EducationItem[] = [
  { school: 'Bicol University Polangui Campus', degree: 'B.S. in Computer Science', graduationDate: '2024' },
  { school: 'Camarines Sur National High School', degree: 'TVL‑ICT – Computer Programming', graduationDate: '2020', honors: 'With Honors' },
  { school: 'Camarines Sur National High School', degree: 'TVL‑ICT – Computer System Servicing (Gr. 7–8)', graduationDate: '2018' },
]

export const skills: Skill[] = [
  { id: 'html5', name: 'HTML5', icon: 'html5', category: 'frontend' },
  { id: 'css3', name: 'CSS3', icon: 'css3', category: 'frontend' },
  { id: 'javascript', name: 'JavaScript', icon: 'javascript', category: 'frontend' },
  { id: 'php', name: 'PHP', icon: 'php', category: 'backend' },
  { id: 'java', name: 'Java', icon: 'java', category: 'backend' },
  { id: 'git', name: 'Git', icon: 'git', category: 'tools' },
  { id: 'wordpress', name: 'WordPress', icon: 'wordpress', category: 'tools' },
  { id: 'bubble', name: 'Bubble.io', icon: 'bubble', category: 'tools' },
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
