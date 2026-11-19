import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { contactInfo, heroContent, navigationItems, resumeUrl } from '@/lib/data'
import { navHref } from '@/components/site-nav'

/** The colophon: the name once more, large, then every way out. Padded below for the phone's tab bar. */
export function SiteFooter() {
  const profiles = contactInfo.socialLinks.filter((link) => link.icon !== 'mail')
  return (
    <footer className="border-t border-gray-line pb-28 md:pb-0">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
        <p className="display-lg reveal max-w-[20ch]">
          {heroContent.name}, <span className="italic text-gray-text">{heroContent.title.toLowerCase()}</span>
        </p>
        <div className="mt-12 grid gap-10 border-t border-gray-line pt-8 text-sm sm:grid-cols-3">
          <div>
            <p className="label mb-3">Site</p>
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link href={navHref(item.href)} className="inline-flex min-h-[32px] items-center">
                    <span className="underline-draw">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-3">Elsewhere</p>
            <ul className="space-y-1">
              {profiles.map((profile) => (
                <li key={profile.name}>
                  <a href={profile.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[32px] items-center gap-1">
                    <span className="underline-draw">{profile.name}</span>
                    <ArrowUpRight aria-hidden="true" className="nudge nudge-up h-3.5 w-3.5 text-gray-text" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-3">Contact</p>
            <ul className="space-y-1">
              <li>
                <a href={`mailto:${contactInfo.email}`} className="inline-flex min-h-[32px] items-center">
                  <span className="underline-draw">{contactInfo.email}</span>
                </a>
              </li>
              <li>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[32px] items-center">
                  <span className="underline-draw">Résumé</span>
                  <span className="sr-only">(PDF, opens in a new tab)</span>
                </a>
              </li>
              <li className="pt-1 text-gray-text">{contactInfo.location}</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-xs text-gray-text">
          © {new Date().getFullYear()} {heroContent.name}
        </p>
      </div>
    </footer>
  )
}
