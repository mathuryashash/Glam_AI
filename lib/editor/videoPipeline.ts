import type { Project } from '@/lib/editor/types'

export const VIDEO_FILTERS = ['cinematic', 'vivid', 'dream', 'mono']

export function setTrimWindow(project: Project, start: number, end: number): Project['editStack'] {
  const safeStart = Math.max(0, Math.min(start, 10))
  const safeEnd = Math.max(safeStart + 1, Math.min(end, 10))
  return {
    ...project.editStack,
    videoTrim: { start: safeStart, end: safeEnd },
  }
}

export function setEffectIntensity(project: Project, intensity: number): Project['editStack'] {
  return {
    ...project.editStack,
    effectIntensity: Math.max(0, Math.min(intensity, 100)),
  }
}
