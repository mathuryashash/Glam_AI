import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { CanvasContainer } from '@/components/editor/CanvasContainer'
import { EditorShell, editorCardStyles } from '@/components/editor/EditorShell'
import { MediaPreview } from '@/components/editor/MediaPreview'
import { Text } from '@/components/ui/Text'
import { useActiveProject, useProjectStore } from '@/lib/editor/projectStore'
import { createExportArtifact, formatLabel } from '@/lib/editor/exportPipeline'
import type { ExportFormat } from '@/lib/editor/types'
import { ACCENT, BORDER } from '@/lib/theme'

const FORMATS: ExportFormat[] = ['story', 'carousel-square', 'carousel-portrait']

export default function ExportScreen() {
  const project = useActiveProject()
  const saveExport = useProjectStore((state) => state.saveExport)
  const [busyFormat, setBusyFormat] = useState<ExportFormat | null>(null)

  const runExport = async (format: ExportFormat) => {
    if (!project) return
    setBusyFormat(format)
    try {
      const uri = await createExportArtifact(project, format)
      saveExport(project.id, format, uri)
    } finally {
      setBusyFormat(null)
    }
  }

  if (!project) {
    return (
      <EditorShell title="Export Lab" subtitle="Import and edit media before exporting.">
        <Pressable style={styles.cta} onPress={() => router.push('/(editor)/import')}>
          <Text style={styles.ctaText}>Import Media</Text>
        </Pressable>
      </EditorShell>
    )
  }

  return (
    <EditorShell
      title="Export Lab"
      subtitle="Pick aspect presets and save a JSON recipe file — not a rendered image or video."
    >
      <CanvasContainer aspect="story" label="Export preview">
        <MediaPreview uri={project.sourceUri} mediaType={project.mediaType} editStack={project.editStack} />
      </CanvasContainer>

      <View style={editorCardStyles.card}>
        <Text style={editorCardStyles.cardTitle}>Format Presets</Text>
        {FORMATS.map((format) => (
          <Pressable key={format} style={styles.exportRow} onPress={() => runExport(format)} disabled={busyFormat !== null}>
            <Text style={styles.exportLabel}>{formatLabel(format)}</Text>
            <Text style={styles.exportState}>
              {busyFormat === format ? 'Saving recipe...' : 'Save JSON recipe'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={editorCardStyles.card}>
        <Text style={editorCardStyles.cardTitle}>Recent Outputs</Text>
        {project.exports.length === 0 ? (
          <Text style={styles.empty}>No exports yet.</Text>
        ) : (
          project.exports.slice(0, 5).map((output) => (
            <View style={styles.outputRow} key={output.id}>
              <Text style={styles.outputName}>{formatLabel(output.format)}</Text>
              <Text style={styles.outputMeta}>{new Date(output.createdAt).toLocaleTimeString()}</Text>
            </View>
          ))
        )}
      </View>
    </EditorShell>
  )
}

const styles = StyleSheet.create({
  cta: { backgroundColor: ACCENT, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  exportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  exportLabel: { color: '#fff', fontSize: 13, fontWeight: '600' },
  exportState: { color: ACCENT, fontSize: 12, fontWeight: '700' },
  outputRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  outputName: { color: '#fff', fontSize: 12 },
  outputMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  empty: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
})
