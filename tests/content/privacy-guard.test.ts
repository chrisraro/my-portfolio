import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { contactInfo } from '@/lib/data'
import { hasPhone, hasStreet, privacyIssues } from '@/tests/helpers/privacy'

// Every public surface runs these guards (S5). A guard that cannot fail
// proves nothing, so each one is shown failing here first.
describe('privacy guards can fail', () => {
  it('catch a mobile number, a bracketed landline and a dashed local number', () => {
    expect(hasPhone('Call +63 917 123 4567')).toBe(true)
    expect(hasPhone('Office (054) 472 1234')).toBe(true)
    expect(hasPhone('Desk 472-1234')).toBe(true)
  })

  it('let years, ranges and ISO dates through', () => {
    expect(hasPhone('August 2020 – July 2024')).toBe(false)
    expect(hasPhone('Updated 2026-11-20')).toBe(false)
    expect(hasPhone('{"dateModified":"2026-11-20"}')).toBe(false)
  })

  it('catch a street, a barangay and a streetAddress field', () => {
    expect(hasStreet('12 Magsaysay Avenue, Naga City')).toBe(true)
    expect(hasStreet('45 Elias Angeles St. Naga')).toBe(true)
    expect(hasStreet('Brgy. San Felipe')).toBe(true)
    expect(hasStreet('{"streetAddress":"x"}')).toBe(true)
  })

  it('let the public locality and a road in a caption through', () => {
    expect(hasStreet(contactInfo.location)).toBe(false)
    expect(hasStreet('Two people on a highland road in the Cordilleras')).toBe(false)
  })

  it('name each guard a text trips, and nothing for the public email', () => {
    expect(privacyIssues('Call +63 917 123 4567')).toEqual(['phone'])
    expect(privacyIssues('12 Magsaysay Avenue')).toEqual(['street'])
    expect(privacyIssues('{"telephone":"x"}')).toEqual(['telephone'])
    expect(privacyIssues('Write to someone@example.com')).toEqual(['email'])
    expect(privacyIssues(`Write to ${contactInfo.email}.`)).toEqual([])
  })

  it('write their word boundaries as backslash-b, never a control byte', () => {
    const source = readFileSync('tests/helpers/privacy.ts', 'utf8')
    expect(source).not.toMatch(/[\x00-\x08\x0B\x0C\x0E-\x1F]/)
    expect(source).toContain('\\b')
  })
})
