import { contactInfo } from '@/lib/data'

// The privacy guards every public surface runs through (CLAUDE.md, Content
// Changes): no phone number, no street address, no telephone field, no email
// but the public one. tests/content/privacy-guard.test.ts shows each guard
// failing, and reads this file: word boundaries are a backslash and a b,
// never a control byte (the S3 lesson).

// ISO dates (a JSON-LD dateModified, 2026-11-20) are not phone numbers.
const ISO_DATE = /\b\d{4}-\d{2}-\d{2}\b/g

// Mobile runs, landlines with an area code in brackets, and dashed local
// numbers. Years and ranges pass.
const PHONE = [/\+?\d[\d\s-]{8,}\d/, /\(\d{2,4}\)\s*\d{3}[\s-]?\d{4}/, /\b\d{3}-\d{4}\b/]

// A house number before a street word, a Philippine sub-locality marker, or a
// schema.org street field. The site names a city at most.
const STREET = [
  /\b\d+[A-Za-z]?\s+(?:[A-Z][\w.'-]*\s+){1,4}(?:Street|St\.|Avenue|Ave\.|Road|Rd\.|Drive|Boulevard|Blvd\.?|Highway)(?!\w)/,
  /\b(?:Brgy\.?|Barangay|Purok|Sitio)\s+\S/i,
  /streetAddress/,
]

const TELEPHONE = /\btelephone\b/i
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/g

export function hasPhone(text: string): boolean {
  const scrubbed = text.replace(ISO_DATE, '')
  return PHONE.some((re) => re.test(scrubbed))
}

export function hasStreet(text: string): boolean {
  return STREET.some((re) => re.test(text))
}

export type PrivacyIssue = 'phone' | 'street' | 'telephone' | 'email'

/** Every guard the text trips; [] means it is safe to publish. */
export function privacyIssues(text: string): PrivacyIssue[] {
  const issues: PrivacyIssue[] = []
  if (hasPhone(text)) issues.push('phone')
  if (hasStreet(text)) issues.push('street')
  if (TELEPHONE.test(text)) issues.push('telephone')
  // A sentence can end on the address; the full stop is not part of it.
  const emails = (text.match(EMAIL) ?? []).map((e) => e.replace(/\.+$/, ''))
  if (emails.some((e) => e !== contactInfo.email)) issues.push('email')
  return issues
}
