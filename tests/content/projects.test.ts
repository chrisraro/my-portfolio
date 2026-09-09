import { describe, expect, it } from 'vitest'
import { projects } from '@/lib/data'
import { BAND_ORDER } from '@/types'

const REMOVED_IDS = ['azalea-main', 'fish2go', 'online-creative-solutions']

describe('project taxonomy', () => {
  it('gives every project exactly one band from the closed vocabulary', () => {
    for (const project of projects) {
      expect(BAND_ORDER).toContain(project.band)
    }
  })

  it('has unique, kebab-case slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('has unique ids', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('lists projects grouped in band order', () => {
    const indexes = projects.map((p) => BAND_ORDER.indexOf(p.band))
    const sorted = [...indexes].sort((a, b) => a - b)
    expect(indexes).toEqual(sorted)
  })

  it('no longer carries the employer-domain projects', () => {
    const ids = projects.map((p) => p.id)
    for (const removed of REMOVED_IDS) {
      expect(ids).not.toContain(removed)
    }
  })

  it('points Graceland at its production domain, not the staging host', () => {
    const graceland = projects.find((p) => p.id === 'graceland')
    expect(graceland?.links.live).toBe('https://graceland.ph')
  })

  it('points Giya at giya.ph', () => {
    const giya = projects.find((p) => p.slug === 'giya')
    expect(giya?.links.live).toBe('https://giya.ph')
  })

  it('uses the live brand name Review Masters Bicol', () => {
    const renamed = projects.find((p) => p.slug === 'review-masters-bicol')
    expect(renamed?.title).toBe('Review Masters Bicol')
  })

  it('never carries an empty optional content field', () => {
    for (const project of projects) {
      if ('dates' in project) expect(project.dates).not.toBe('')
      if ('contribution' in project) expect(project.contribution).not.toBe('')
    }
  })
})

describe('project inventory', () => {
  it('holds exactly fifteen projects', () => {
    expect(projects).toHaveLength(15)
  })

  it('distributes them across the four bands as designed', () => {
    const count = (band: string) => projects.filter((p) => p.band === band).length
    expect(count('Products')).toBe(3)
    expect(count('Custom systems')).toBe(2)
    expect(count('Applications')).toBe(1)
    expect(count('Sites')).toBe(9)
  })

  it('carries the full inventory by slug', () => {
    expect(projects.map((p) => p.slug)).toEqual([
      'iskotify',
      'giya',
      'latag',
      'beachbus-nfc-card-system',
      'ocs-wp-control-panel',
      'aman-group-web-app',
      'graceland-bicolano-dining',
      'el-nido-guide-ph',
      'beachbus-palawan',
      'review-masters-bicol',
      'acad1-review-center',
      'downtown-district-hotel',
      'azalea-baguio',
      'azalea-boracay',
      'aralabroad',
    ])
  })

  it('features exactly six projects', () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(6)
  })

  it('gives every project a live link unless it is internal', () => {
    for (const project of projects) {
      if (project.status === 'internal') {
        expect(project.links.live).toBeUndefined()
      } else {
        expect(project.links.live).toMatch(/^https:\/\//)
      }
    }
  })
})
