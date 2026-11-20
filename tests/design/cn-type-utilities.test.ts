import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

// tailwind-merge reads an unknown text-* as a colour and drops it next to text-ink.
// cn() is told the custom type utilities in app/globals.css are font sizes.
describe('cn keeps the custom type utilities', () => {
  it.each(['text-section', 'text-display', 'text-page-h1', 'text-title', 'text-lede'])('%s survives a text colour', (type) => {
    const merged = cn(`${type} mb-10 text-ink`, 'mb-0').split(' ')
    expect(merged).toContain(type)
    expect(merged).toContain('text-ink')
    expect(merged).toContain('mb-0')
    expect(merged).not.toContain('mb-10')
  })

  it('keeps the muted colour beside text-display and text-page-h1', () => {
    for (const type of ['text-display', 'text-page-h1']) expect(cn(type, 'text-muted').split(' ')).toEqual([type, 'text-muted'])
  })

  it('still lets a later colour replace an earlier one', () => {
    expect(cn('text-ink', 'text-muted')).toBe('text-muted')
  })
})
