import type { DisplayStatus, ProjectStatus } from '@/types'

// A Record, so adding a ProjectStatus is a compile error until it is mapped here.
const MAP: Record<ProjectStatus, DisplayStatus> = {
  live: 'live',
  'ua-gated': 'live',
  'early-access': 'early-access',
  'auth-gated': 'private',
  internal: 'internal',
}

export const DISPLAY_STATUS_LABEL: Record<DisplayStatus, string> = {
  live: 'Live',
  'early-access': 'Early access',
  private: 'Private',
  internal: 'Internal',
}

export function displayStatus(status: ProjectStatus): DisplayStatus {
  return MAP[status]
}
