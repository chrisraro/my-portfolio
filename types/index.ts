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
  | 'directory'

// Hospitality first: the primary buyer is a Philippine tourism or hospitality
// owner. The last two never occur among client work.
export const SECTOR_ORDER: readonly ProjectSector[] = [
  'hotel',
  'tours',
  'restaurant',
  'review-centre',
  'directory',
  'education',
  'real-estate',
  'product',
  'internal-tool',
]

// Drives how a project can be previewed. Three of eighteen cannot be embedded
// live: two reject non-browser user-agents and one sits behind a login. `staging`
// is a pre-launch site: linked, but neither live nor shipped.
export type ProjectStatus =
  | 'live'
  | 'early-access'
  | 'auth-gated'
  | 'ua-gated'
  | 'internal'
  | 'staging'

// What a visitor sees. Six data statuses collapse to five: `ua-gated` sites are
// live in any browser, and only the preview mechanism needs the distinction.
export type DisplayStatus = 'live' | 'early-access' | 'private' | 'internal' | 'staging'

/** How exact a pin is: a city's centre (a dot) or a whole region's (a ring). */
export type PlacePrecision = 'city' | 'region'

/**
 * A project's verified place on the field map (spec §5, the map data rule).
 * `evidence` quotes the words in the project's own title or description that
 * name the place; tests/content/places.test.ts checks it.
 */
export interface ProjectPlace {
  name: string
  region: string
  /** Public city or region centre, two decimals. */
  lat: number
  lng: number
  precision: PlacePrecision
  evidence: string
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  /**
   * What it does, at most 56 characters: "Who it's for · what it does ·
   * gateways". Written only from `description` and `technologies`; a gateway
   * is named only when it is in `technologies`. Shown on the board.
   */
  summary: string;
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
  /** Where the project runs, only where its own words name the place. */
  place?: ProjectPlace;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  category: 'WordPress & e-commerce' | 'Frontend' | 'Backend' | 'AI & automation' | 'Tools & DevOps';
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

/** A published number. The literal `true` makes an unapproved number a compile error. */
export interface CaseStudyMetric {
  value: string
  label: string
  /** Christian confirmed the client agreed to publish this number. */
  clientApproved: true
}

export interface CaseStudyDecision {
  chose: string
  over: string
  because: string
}

export interface CaseStudyStackItem {
  name: string
  why: string
}

/** A flagship's researched case study. Every sentence traces to a dossier source or to Christian. */
export interface CaseStudy {
  /** Equals a Project.slug. */
  slug: string
  /** What Christian did, e.g. "Sole developer: design, build and payments". */
  role: string
  brief: string[]
  built: string[]
  /** Two to four. */
  decisions: CaseStudyDecision[]
  stack: CaseStudyStackItem[]
  /** Qualitative. Numbers go in `metrics`. */
  outcome: string[]
  metrics?: CaseStudyMetric[]
  /** Other project slugs told as part of this story, e.g. the BeachBus NFC system. */
  related?: string[]
}

/** An eyebrow and an h2: the heading stack every section shares. */
export interface SectionCopy {
  eyebrow: string
  title: string
}

/** A question-style section on a service page (spec §6, citability). */
export interface ServiceSection {
  question: string
  /** Short paragraphs, first person. */
  answer: string[]
}

/** One row of a service page's comparison table. */
export interface ServiceComparisonRow {
  /** The row's header cell: what the job needs, or a gateway's name. */
  need: string
  choice: string
  /** The projects that show it, as `Project.id`s; the page prints their titles. */
  projectIds: string[]
}

export interface ServiceComparison {
  caption: string
  columns: [string, string, string]
  rows: ServiceComparisonRow[]
}

export type ServiceSlug = 'full-stack-development' | 'wordpress-woocommerce' | 'ai-automation'

/** A page under /services (spec §5), its copy drawn only from the data. */
export interface ServicePage {
  slug: ServiceSlug
  /** The page's <title>, from the spec's titles table. */
  title: string
  /** The h1, and the service's name on /services. */
  name: string
  /** One line for the /services list. */
  summary: string
  /** The search phrase the page answers (tests/content/new-pages.test.ts). */
  keyword: string
  /** The 40-60 word answer that opens the page, third person. */
  answer: string
  sections: ServiceSection[]
  comparison?: ServiceComparison
  /** The projects that prove the service, as `Project.id`s, strongest first. */
  projectIds: string[]
}

export interface ServicesPageContent {
  /** The page's <title>. */
  title: string
  eyebrow: string
  /** The h1. */
  heading: string
  readonly answer: string
  /** The heading over each service page's proving projects. */
  proof: SectionCopy
}

export interface AboutPageContent {
  title: string
  eyebrow: string
  heading: string
  keyword: string
  readonly answer: string
  story: SectionCopy & { readonly paragraphs: string[] }
  timeline: SectionCopy
  testimonials: SectionCopy
}

export interface HireNote {
  title: string
  body: string
}

export interface HireLink {
  label: string
  href?: string
}

export interface HirePageContent {
  title: string
  eyebrow: string
  heading: string
  keyword: string
  readonly answer: string
  facts: { title: string; labels: { availability: string; base: string; code: string } }
  /** Core: skill ids that run in projects on this site; the rest of `skills` follows by category. */
  stack: SectionCopy & { coreLabel: string; coreNote: string; coreIds: string[]; moreLabel: string }
  howIWork: SectionCopy & { readonly notes: HireNote[]; aiLead: string; aiInUse: HireLink[] }
  history: SectionCopy
}

/** Where the services are offered (spec §6): the Service nodes' areaServed and channel. */
export interface ServiceArea {
  city: string
  region: string
  country: string
  /** How work beyond the region is done. */
  remote: string
}
