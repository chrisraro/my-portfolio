import { contactInfo, heroContent } from '@/lib/data'

export function Footer() {
  const links = contactInfo.socialLinks.filter((link) => link.icon !== 'mail')

  return (
    <footer className="border-t border-line">
      {/* pb-20 below sm keeps the last row clear of the fixed chat launcher. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pb-20 pt-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pb-8">
        <p>
          © {new Date().getFullYear()} {heroContent.name}
        </p>
        <ul className="flex gap-5">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center transition-colors hover:text-accent sm:min-h-[32px]"
              >
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
