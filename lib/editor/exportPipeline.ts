import * as FileSystem from 'expo-file-system/legacy'
import type { ExportFormat, Project } from '@/lib/editor/types'

const EXPORT_DIR = `${FileSystem.documentDirectory}editor-exports/`

export function formatLabel(format: ExportFormat) {
  if (format === 'story') return 'Story 9:16'
  if (format === 'carousel-square') return 'Carousel 1:1'
  return 'Carousel 4:5'
}

export async function createExportArtifact(project: Project, format: ExportFormat): Promise<string> {
  await FileSystem.makeDirectoryAsync(EXPORT_DIR, { intermediates: true })
  const outputUri = `${EXPORT_DIR}${project.id}-${format}-${Date.now()}.json`
  const payload = {
    artifactType: 'editor-recipe-v1' as const,
    projectId: project.id,
    sourceUri: project.sourceUri,
    format,
    createdAt: Date.now(),
    editStack: project.editStack,
    note: 'JSON recipe file only — edit stack + format preset, not a rendered image or video.',
  }
  await FileSystem.writeAsStringAsync(outputUri, JSON.stringify(payload, null, 2))
  return outputUri
}
