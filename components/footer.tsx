import { contactInfo, footerContent, heroContent } from '@/lib/data'

export function Footer() {
  const links = contactInfo.socialLinks.filter((link) => link.icon !== 'mail')

  return (
    <footer className="border-t border-line">
      {/* pb-24 below lg keeps the last row clear of the fixed chat launcher. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-24 pt-10 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:pb-10">
        <div>
          <p className="font-display text-2xl font-bold leading-none [font-variation-settings:'wdth'_75]">
            {heroContent.name}
          </p>
          <p className="edge-code mt-3 text-[0.8125rem] text-muted">
            © {new Date().getFullYear()} · {footerContent.colophon}
          </p>
        </div>
        <ul className="-ml-2 flex flex-wrap gap-x-2 sm:ml-0 sm:-mr-2">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center px-2 text-sm font-medium text-muted-strong transition-colors duration-[var(--dur-fast)] ease-[var(--ease-sharp)] hover:text-ink"
              >
                <span className="link-draw">{link.name}</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
