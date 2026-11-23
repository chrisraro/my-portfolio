import { SECTION } from '@/components/ui/grid'
import { contactInfo, footerContent, heroContent, resumeUrl } from '@/lib/data'
import { cn } from '@/lib/utils'

export function Footer() {
  const links = contactInfo.socialLinks.filter((link) => link.icon !== 'mail')
  const linkClass =
    'inline-flex min-h-[44px] items-center text-muted-strong transition-colors duration-[var(--dur-fast)] ease-[var(--ease-sharp)] hover:text-ink'

  return (
    <footer>
      {/* pb-24 keeps the last row above the fixed chat launcher (80px tall from the bottom). */}
      <div className={cn(SECTION, 'pb-24')}>
        <div className="flex flex-col gap-x-8 border-t border-line pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted">
            © {new Date().getFullYear()} {heroContent.name} · {footerContent.base.place}
          </p>
          <ul className="flex flex-wrap gap-x-5">
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
      </div>
    </footer>
  )
}
