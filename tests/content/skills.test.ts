import { describe, expect, it } from 'vitest'
import { skills } from '@/lib/data'

// Cut deliberately (spec §7). A skill returning to this list is a content
// regression, not an addition. Claude Code and Render were removed from it
// by Christian's explicit decision (lobby-rack refinement, Task 1).
const CUT_IDS = [
  'bubble',
  'gemini-cli', 'qoder', 'google-ai-studio',
  'figma', 'vscode',
  'paypal', 'maya', 'xendit',
  'html5', 'css3', 'javascript',
  'java', 'mysql', 'firebase', 'github',
  'clerk', 'coolify',
  'generatepress', 'generateblocks',
]

describe('skills', () => {
  it('stays within the 12 to 21 range (15 plus the six AI and deployment tools Christian added)', () => {
    expect(skills.length).toBeGreaterThanOrEqual(12)
    expect(skills.length).toBeLessThanOrEqual(21)
  })

  it('carries none of the cut entries', () => {
    const ids = skills.map((s) => s.id)
    for (const cut of CUT_IDS) {
      expect(ids).not.toContain(cut)
    }
  })

  it('keeps every category populated', () => {
    for (const category of ['WordPress & e-commerce', 'Frontend', 'Backend', 'AI & automation', 'Tools & DevOps']) {
      expect(skills.some((s) => s.category === category)).toBe(true)
    }
  })

  it('has unique ids', () => {
    const ids = skills.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('lists the AI and automation tools, and Render under Tools & DevOps', () => {
    const ai = skills.filter((s) => s.category === 'AI & automation').map((s) => s.name)
    expect(ai).toEqual(['Claude Code', 'Codex', 'Qwen Code', 'n8n', 'Groq / LLM APIs'])
    expect(skills.find((s) => s.id === 'render')).toMatchObject({ name: 'Render', category: 'Tools & DevOps' })
  })

  // Critique R5 P1: WordPress is the specialism, so it is its own group and
  // leads the stack, not a chip filed under Tools & DevOps.
  it('gives WordPress and WooCommerce their own group, first', () => {
    const wp = skills.filter((s) => s.category === 'WordPress & e-commerce').map((s) => s.name)
    expect(wp).toEqual(['WordPress', 'WooCommerce'])
    const order = Array.from(new Set(skills.map((s) => s.category)))
    expect(order).toEqual(['WordPress & e-commerce', 'Frontend', 'Backend', 'AI & automation', 'Tools & DevOps'])
  })
})
