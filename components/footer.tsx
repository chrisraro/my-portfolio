import { SECTION } from '@/components/ui/grid'
import { contactInfo, footerContent, heroContent, resumeUrl } from '@/lib/data'
import { cn } from '@/lib/utils'

export function Footer() {
  const links = contactInfo.socialLinks.filter((link) => link.icon !== 'mail')
  const linkClass =
    'map-label inline-flex min-h-[44px] items-center px-2 text-muted-strong transition-colors duration-[var(--dur-fast)] ease-[var(--ease-sharp)] hover:text-ink'

  return (
    <footer className="border-t border-line">
      {/* pb-24 below lg keeps the last row clear of the fixed chat launcher. */}
      <div className={cn(SECTION, 'grid gap-8 pb-24 pt-12 sm:grid-cols-[1fr_auto] sm:items-end lg:pb-12')}>
        <div>
          <p className="text-display text-[2.5rem]">{heroContent.name}</p>
          <p className="map-label mt-4 text-muted-strong">Base · {footerContent.base.place}</p>
          <p className="tabular mt-1 text-sm text-muted">{footerContent.base.coordinates}</p>
          <p className="mt-4 text-sm text-muted">
            © {new Date().getFullYear()} · {footerContent.colophon}
          </p>
        </div>
        <ul className="-ml-2 flex flex-wrap gap-x-2 sm:ml-0 sm:-mr-2">
          <li>
            <a href={resumeUrl} className={linkClass}>
              Résumé
            </a>
          </li>
          {links.map((link) => (
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {link.name}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
