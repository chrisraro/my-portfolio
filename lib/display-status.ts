import type { DisplayStatus, ProjectStatus } from '@/types'

// A Record, so adding a ProjectStatus is a compile error until it is mapped here.
const MAP: Record<ProjectStatus, DisplayStatus> = {
  live: 'live',
  'ua-gated': 'live',
  'in-development': 'in-development',
  'auth-gated': 'private',
  internal: 'internal',
  staging: 'staging',
}

export const DISPLAY_STATUS_LABEL: Record<DisplayStatus, string> = {
  live: 'Live',
  'in-development': 'In development',
  private: 'Private',
  internal: 'Internal',
  staging: 'Staging',
}

export function displayStatus(status: ProjectStatus): DisplayStatus {
  return MAP[status]
}
