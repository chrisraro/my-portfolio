import { describe, expect, it } from 'vitest'
import { DISPLAY_STATUS_LABEL, displayStatus } from '@/lib/display-status'
import { projects } from '@/lib/data'
import type { ProjectStatus } from '@/types'

const ALL: ProjectStatus[] = ['live', 'in-development', 'auth-gated', 'ua-gated', 'internal', 'staging']

describe('displayStatus', () => {
  it('maps every data status to a labelled display status', () => {
    for (const status of ALL) {
      const display = displayStatus(status)
      expect(DISPLAY_STATUS_LABEL[display]).toBeTruthy()
    }
  })

  it('shows UA-gated sites as live, because to a visitor they are', () => {
    expect(displayStatus('ua-gated')).toBe('live')
  })

  it('labels a project in development, and does not call it live', () => {
    expect(displayStatus('in-development')).toBe('in-development')
    expect(DISPLAY_STATUS_LABEL['in-development']).toBe('In development')
    expect(Object.keys(DISPLAY_STATUS_LABEL)).not.toContain('early-access')
  })

  it('shows a staging site as staging, not live', () => {
    expect(displayStatus('staging')).toBe('staging')
  })

  it('calls the auth-gated panel private', () => {
    expect(displayStatus('auth-gated')).toBe('private')
  })

  it('handles every status actually used in the inventory', () => {
    for (const project of projects) {
      expect(DISPLAY_STATUS_LABEL[displayStatus(project.status)]).toBeTruthy()
    }
  })
})
