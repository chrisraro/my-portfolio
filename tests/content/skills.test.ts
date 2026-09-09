import { describe, expect, it } from 'vitest'
import { skills } from '@/lib/data'

// Cut deliberately (spec §7). A skill returning to this list is a content
// regression, not an addition.
const CUT_IDS = [
  'bubble',
  'claude-code', 'gemini-cli', 'qoder', 'google-ai-studio',
  'figma', 'vscode',
  'paypal', 'maya', 'xendit',
  'html5', 'css3', 'javascript',
  'java', 'mysql', 'firebase', 'github',
  'render', 'clerk', 'coolify',
  'generatepress', 'generateblocks',
]

describe('skills', () => {
  it('stays within the 12 to 15 range the spec allows', () => {
    expect(skills.length).toBeGreaterThanOrEqual(12)
    expect(skills.length).toBeLessThanOrEqual(15)
  })

  it('carries none of the cut entries', () => {
    const ids = skills.map((s) => s.id)
    for (const cut of CUT_IDS) {
      expect(ids).not.toContain(cut)
    }
  })

  it('keeps every category populated', () => {
    for (const category of ['Frontend', 'Backend', 'Tools & DevOps']) {
      expect(skills.some((s) => s.category === category)).toBe(true)
    }
  })

  it('has unique ids', () => {
    const ids = skills.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
