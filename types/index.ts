export type ProjectBand = 'Products' | 'Custom systems' | 'Applications' | 'Sites'

// Canonical display order. `Applications` and `Sites` are shown together on the
// home page under "Client work"; they stay separate on /projects, where the
// distinction is what a visitor is browsing by.
export const BAND_ORDER: readonly ProjectBand[] = [
  'Products',
  'Custom systems',
  'Applications',
  'Sites',
]

// Who a project was built for. Closed vocabulary; the hero's specialism line
// names the sectors of the Sites band, and the board sorts client work by it.
export type ProjectSector =
  | 'hotel'
  | 'tours'
  | 'restaurant'
  | 'review-centre'
  | 'education'
  | 'real-estate'
  | 'product'
  | 'internal-tool'

// Hospitality first: the primary buyer is a Philippine tourism or hospitality
// owner. The last two never occur among client work.
export const SECTOR_ORDER: readonly ProjectSector[] = [
  'hotel',
  'tours',
  'restaurant',
  'review-centre',
  'education',
  'real-estate',
  'product',
  'internal-tool',
]

// Drives how a project can be previewed. Three of fifteen cannot be embedded
// live: two reject non-browser user-agents and one sits behind a login.
export type ProjectStatus =
  | 'live'
  | 'early-access'
  | 'auth-gated'
  | 'ua-gated'
  | 'internal'

// What a visitor sees. Five data statuses collapse to four: `ua-gated` sites are
// live in any browser, and only the preview mechanism needs the distinction.
export type DisplayStatus = 'live' | 'early-access' | 'private' | 'internal'

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  band: ProjectBand;
  /** Who it was built for, from what the description already says. */
  sector: ProjectSector;
  image: string;
  technologies: string[];
  links: {
    live?: string;
    github?: string;
    appStore?: string;
    playStore?: string;
    download?: string;
  };
  status: ProjectStatus;
  /** Human date range, e.g. 'March – April 2025'. Omitted where unverified. */
  dates?: string;
  /** What Christian personally built. Written in Phase 3; omitted until then. */
  contribution?: string;
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
  /**
   * Note shown beside a role that overlapped another. Holding a full-time
   * corporate role while shipping agency client work is capacity evidence for
   * a freelance-primary audience, so it is stated rather than hidden.
   */
  concurrent?: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  /** Human date range, e.g. 'August 2020 – July 2024'. */
  dates: string;
  honors?: string;
}

export interface Recommendation {
  id: number;
  quote: string;
  authorName: string;
  authorTitle: string;
  /**
   * The project this quote refers to, when one exists in `projects`. Attaching
   * a quote to its case study turns general praise into project-specific
   * proof. Omitted where the author's organisation has no entry.
   */
  projectId?: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  /** Short description of the image itself, for screen readers. */
  alt: string;
  /** Visible caption. This is the proof; it must not hide behind a hover. */
  caption: string;
}
