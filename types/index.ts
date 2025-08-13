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
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
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
