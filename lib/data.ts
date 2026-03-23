import { Project, Skill, SocialLink, ContactInfo, ExperienceItem, EducationItem, Recommendation, GalleryImage, Achievement } from '@/types'

export const projects: Project[] = [
  {
    id: 'online-creative-solutions',
    title: 'Online Creative Solutions',
    description: 'Online Marketing Agency Website with modern design and marketing tools integration.',
    category: 'WordPress Development',
    image: '/assets/images/projects/onlinecreativesolutions.webp',
    technologies: ['WordPress', 'Marketing', 'SEO', 'Digital Marketing'],
    links: { live: 'https://onlinecreativesolutions.com' },
    featured: true,
  },
  {
    id: 'naga-perks-giya-app',
    title: 'Naga Perks by Giya',
    description: 'Naga Perks by Giya is a hyperlocal discovery and privilege app that unlocks new experiences and perks for locals. The platform connects three key user types: (Customer, Business, and Influencer) it has also an Admin Module for managing the entire system.',
    category: 'Node.js + Next.js + Supabase + Tailwind CSS + PWA features',
    image: '/assets/images/projects/giya-app.webp',
    technologies: ['Node.js', 'Next.js', 'Tailwind CSS', 'Supabase', 'PWA'],
    links: { live: 'https://giya.vercel.app' },
    featured: false,
  },
  {
    id: 'fish2go',
    title: 'Fish2Go',
    description: 'WooCommerce WordPress website for seafood delivery service with online ordering and payment integration.',
    category: 'WordPress + WooCommerce',
    image: '/assets/images/projects/fish2go.webp',
    technologies: ['WordPress', 'WooCommerce', 'Payments', 'Online Ordering'],
    links: { live: 'https://onlinecreativesolutions.com/fish2go' },
    featured: false,
  },
  {
    id: 'azalea-main',
    title: 'Azalea Main',
    description: 'Hotel website with booking system, room showcase, and online reservation capabilities.',
    category: 'Hotel Website',
    image: '/assets/images/projects/azaleamain.webp',
    technologies: ['WordPress', 'Booking System', 'Hotel Management'],
    links: { live: 'https://onlinecreativesolutions.com/azaleamain' },
    featured: false,
  },
  {
    id: 'downtown-district-hotel',
    title: 'Downtown District Hotel',
    description: 'Modern hotel website with room booking, amenities showcase, and contact management.',
    category: 'Hotel Website',
    image: '/assets/images/projects/downtowndistricthotel.webp',
    technologies: ['WordPress', 'Booking System', 'Hotel Management'],
    links: { live: 'https://downtowndistricthotel.ph' },
    featured: false,
  },
  {
    id: 'beachbus',
    title: 'BeachBus Palawan',
    description: 'WordPress site with GeneratePress Premium + GenerateBlocks Pro, WooCommerce storefront for digital products, and payment integration.',
    category: 'WordPress Development',
    image: '/assets/images/projects/beachbus.webp',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'Payments'],
    links: { live: 'https://beachbus.ph' },
    featured: true,
  },
  {
    id: 'elnido',
    title: 'El Nido Guide PH',
    description: 'WordPress site using GeneratePress Premium and GenerateBlocks Pro. Custom child theme code for booking, product add-ons, invoice printing, PayPal payments, and WooCommerce storefront.',
    category: 'WordPress Development',
    image: '/assets/images/projects/elnidoguide.webp',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'PayPal'],
    links: { live: 'https://elnidoguide.ph' },
    featured: true,
  },
  {
    id: 'aman-webapp',
    title: 'Aman Group of Companies Web App',
    description: "Full-stack Next.js app for a real estate company: projects/properties showcase, visit scheduling, loan calculator, and broker referral links. Leveraged Vercel, Supabase, Upstash.",
    category: 'Full-Stack Web App',
    image: '/assets/images/projects/amangroupofcompanies.webp',
    technologies: ['Next.js', 'React', 'Vercel', 'Supabase', 'Upstash'],
    links: { live: 'https://amangroup-webapp.enjoyrealty.com' },
    featured: false,
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
    featured: false,
  },
  {
    id: 'muramart',
    title: 'Muramart App',
    description: 'Full-stack Bubble.io web and mobile app with UI/UX design and backend workflow + API maintenance.',
    category: 'Bubble.io App',
    image: '/assets/images/projects/muramartv2.webp',
    technologies: ['Bubble.io', 'Mobile', 'API'],
    links: { live: 'https://muramartv2.com', playStore: 'https://play.google.com/store/apps/details?id=com.wnapp.id1705363159277' },
    featured: false,
  },
  {
    id: 'arway',
    title: 'ARWay (CampusNav)',
    description: 'AR navigation app for thesis using Flutter and ARWay; integrated plugins for immersive experience.',
    category: 'AR Mobile Application',
    image: '/assets/images/projects/ARway Screenshot.jpg',
    technologies: ['Flutter', 'ARWay', 'Unity'],
    links: {},
    featured: false,
  },
  {
    id: 'upcat-review-plus',
    title: 'UPCAT Review Plus',
    description: 'Review center website with online reservation powered by WooCommerce and event entry system using QR code.',
    category: 'WordPress + WooCommerce',
    image: '/assets/images/projects/upcatreviewplus.webp',
    technologies: ['WordPress', 'WooCommerce', 'QR Code', 'Online Reservation'],
    links: { live: 'https://upcatreviewplus.com' },
    featured: true,
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
  { id: 'bubble', name: 'Bubble.io', icon: 'bubble', category: 'Tools & DevOps' },
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
  { id: 1, src: "/assets/images/gallery/AmanWebAppPresentation.jpg", alt: "Web App Presentation on ERDC's Brokers Meeting" },
  { id: 2, src: "/assets/images/gallery/TeamBuildingWorkshopTagaytayEnjoyRealty.jpg", alt: "Team Building Workshop in Tagaytay with Enjoy Realty and Development Corporation" },
  { id: 3, src: "/assets/images/gallery/ElNidoSolo3.jpg", alt: "Solo Travel in El Nido which is sponsored of one of our client on our agency, Then as my personal client for their Internal NFC Web App System" },
  { id: 4, src: "/assets/images/gallery/BeachBusatPort.jpg", alt: "BeachBus arrival at El Nido Port which is the new mode of Public Transportation in El Nido! Where I develop its website and the internal NFC Card system" },
  { id: 5, src: "/assets/images/gallery/InsideBeachBuswithBosses.jpg", alt: "During the Test Ride of the BeachBus at El Nido" },
  { id: 6, src: "/assets/images/gallery/AtokwithJewel3.jpg", alt: "Traveling to Cordillera with my Love, Jewel" }
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
