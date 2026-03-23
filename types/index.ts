export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  technologies: string[];
  links: {
    live?: string;
    github?: string;
    appStore?: string;
    playStore?: string;
    download?: string;
  };
  featured?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  category: 'Frontend' | 'Backend' | 'Tools & DevOps';
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  email: string;
  location: string;
  socialLinks: SocialLink[];
}

export interface Theme {
  name: 'light' | 'dark';
  label: string;
  icon: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  dates: string;
  location: string;
  responsibilities: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  graduationDate: string;
  honors?: string;
}

export interface Recommendation {
  id: number;
  quote: string;
  authorName: string;
  authorTitle: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export interface Achievement {
  id: number;
  title: string;
  description?: string;
  link?: string;
}
