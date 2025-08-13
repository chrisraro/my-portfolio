import { Project, Skill, SocialLink, ContactInfo } from '@/types'

export const projects: Project[] = [
  {
    id: 'acad1',
    title: 'Acad1 Review Center',
    description: 'A comprehensive educational platform showcasing review center services, built with WordPress and WooCommerce integration for seamless e-commerce functionality.',
    category: 'WordPress Development',
    image: '/assets/images/projects/Acad1 Screenshot.png',
    technologies: ['WordPress', 'GeneratePress', 'WooCommerce', 'Xendit'],
    links: {
      live: 'https://acad1.ph',
      github: '#'
    }
  },
  {
    id: 'muramart',
    title: 'Muramart',
    description: 'An innovative agri-ecommerce mobile application built with Bubble.io, featuring seamless UI/UX design and comprehensive backend workflows for agricultural commerce.',
    category: 'Mobile App Development',
    image: '/assets/images/projects/Muramart Screenshot.png',
    technologies: ['Bubble.io', 'Xendit', 'Mobile App'],
    links: {
      appStore: 'https://apps.apple.com/app/id1589941523',
      playStore: 'https://play.google.com/store/apps/details?id=com.wnapp.id1705363159277'
    }
  },
  {
    id: 'arway',
    title: 'ARWay (CampusNav)',
    description: 'A cutting-edge Augmented Reality navigation application built using Flutter, Unity, and C#, providing immersive campus navigation experiences.',
    category: 'AR Mobile Application',
    image: '/assets/images/projects/ARway Screenshot.jpg',
    technologies: ['Flutter', 'Unity', 'C#', 'AR'],
    links: {
      github: '#',
      download: 'https://drive.google.com/file/d/1FeThKAcsLwR-oDy8nsvah88XahDJp6RR/view'
    }
  }
]

export const skills: Skill[] = [
  { id: 'html5', name: 'HTML5', icon: 'html5', category: 'frontend' },
  { id: 'css3', name: 'CSS3', icon: 'css3', category: 'frontend' },
  { id: 'javascript', name: 'JavaScript', icon: 'javascript', category: 'frontend' },
  { id: 'php', name: 'PHP', icon: 'php', category: 'backend' },
  { id: 'java', name: 'Java', icon: 'java', category: 'backend' },
  { id: 'git', name: 'Git', icon: 'git', category: 'tools' },
  { id: 'wordpress', name: 'WordPress', icon: 'wordpress', category: 'tools' },
  { id: 'bubble', name: 'Bubble.io', icon: 'bubble', category: 'tools' }
]

export const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/chrisrarss?mibextid=ZbWKwL',
    icon: 'facebook'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/chrisraro',
    icon: 'github'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/christian-raro',
    icon: 'linkedin'
  },
  {
    name: 'Email',
    url: 'mailto:rarochristian029@gmail.com',
    icon: 'mail'
  }
]

export const contactInfo: ContactInfo = {
  email: 'rarochristian029@gmail.com',
  location: 'Naga City, Camarines Sur, Philippines',
  socialLinks
}

export const navigationItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Works', href: '#works' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' }
]
