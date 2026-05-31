import type { Project } from '@/lib/editor/types'

export const RETOUCH_PRESETS = [
  { id: 'natural', label: 'Natural' },
  { id: 'soft-glow', label: 'Soft Glow' },
  { id: 'studio', label: 'Studio' },
]

export const BG_TEMPLATES = [
  { id: 'sunset', label: 'Sunset Loft' },
  { id: 'neon', label: 'Neon Studio' },
  { id: 'minimal', label: 'Minimal White' },
]

export function applyRetouchPreset(project: Project, presetId: string): Project['editStack'] {
  return { ...project.editStack, retouchPreset: presetId }
}

export function toggleBackgroundRemoval(project: Project, enabled: boolean): Project['editStack'] {
  return { ...project.editStack, backgroundRemoved: enabled }
}

export function selectBackgroundTemplate(project: Project, templateId: string): Project['editStack'] {
  return {
    ...project.editStack,
    backgroundRemoved: true,
    backgroundTemplateId: templateId,
  }
}

export function setObjectRemovalMask(project: Project, maskId: string): Project['editStack'] {
  return { ...project.editStack, objectRemovalMaskId: maskId }
}
