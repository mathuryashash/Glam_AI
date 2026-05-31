import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { CanvasContainer } from '@/components/editor/CanvasContainer'
import { MediaPreview } from '@/components/editor/MediaPreview'
import { EditorShell, editorCardStyles } from '@/components/editor/EditorShell'
import { Text } from '@/components/ui/Text'
import { useActiveProject, useProjectStore } from '@/lib/editor/projectStore'
import { VIDEO_FILTERS, setEffectIntensity, setTrimWindow } from '@/lib/editor/videoPipeline'
import { ACCENT, BORDER } from '@/lib/theme'

export default function VideoScreen() {
  const project = useActiveProject()
  const updateEditStack = useProjectStore((state) => state.updateEditStack)
  const addFilter = useProjectStore((state) => state.addFilter)
  const removeFilter = useProjectStore((state) => state.removeFilter)

  if (!project) {
    return (
      <EditorShell title="Video Edit" subtitle="Import a short clip to unlock timeline tools.">
        <Pressable style={styles.cta} onPress={() => router.push('/(editor)/import')}>
          <Text style={styles.ctaText}>Import Clip</Text>
        </Pressable>
      </EditorShell>
    )
  }

  const { videoTrim, effectIntensity, appliedFilters } = project.editStack

  return (
    <EditorShell
      title="Video Edit"
      subtitle="Trim and filter preview in-app. Export saves a recipe file — no native video render."
    >
      <CanvasContainer aspect="story" label={`Trim ${videoTrim.start}s – ${videoTrim.end}s • 9:16 preview`}>
        <MediaPreview uri={project.sourceUri} mediaType={project.mediaType} editStack={project.editStack} />
      </CanvasContainer>

      <View style={editorCardStyles.card}>
        <Text style={editorCardStyles.cardTitle}>Trim Window</Text>
        <View style={styles.row}>
          <Pressable
            style={styles.controlBtn}
            onPress={() => updateEditStack(project.id, setTrimWindow(project, Math.max(0, videoTrim.start - 1), videoTrim.end))}
          >
            <Text style={styles.controlText}>Start -1s</Text>
          </Pressable>
          <Pressable
            style={styles.controlBtn}
            onPress={() => updateEditStack(project.id, setTrimWindow(project, videoTrim.start + 1, videoTrim.end))}
          >
            <Text style={styles.controlText}>Start +1s</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={styles.controlBtn}
            onPress={() => updateEditStack(project.id, setTrimWindow(project, videoTrim.start, videoTrim.end - 1))}
          >
            <Text style={styles.controlText}>End -1s</Text>
          </Pressable>
          <Pressable
            style={styles.controlBtn}
            onPress={() => updateEditStack(project.id, setTrimWindow(project, videoTrim.start, videoTrim.end + 1))}
          >
            <Text style={styles.controlText}>End +1s</Text>
          </Pressable>
        </View>
      </View>

      <View style={editorCardStyles.card}>
        <Text style={editorCardStyles.cardTitle}>Effect Layers</Text>
        <View style={styles.chips}>
          {VIDEO_FILTERS.map((filter) => {
            const active = appliedFilters.includes(filter)
            return (
              <Pressable
                key={filter}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => (active ? removeFilter(project.id, filter) : addFilter(project.id, filter))}
              >
                <Text style={styles.chipText}>{filter}</Text>
              </Pressable>
            )
          })}
        </View>
        <View style={styles.row}>
          <Pressable
            style={styles.controlBtn}
            onPress={() => updateEditStack(project.id, setEffectIntensity(project, effectIntensity - 10))}
          >
            <Text style={styles.controlText}>Intensity -10</Text>
          </Pressable>
          <Pressable
            style={styles.controlBtn}
            onPress={() => updateEditStack(project.id, setEffectIntensity(project, effectIntensity + 10))}
          >
            <Text style={styles.controlText}>Intensity +10</Text>
          </Pressable>
        </View>
        <Text style={styles.intensity}>Current intensity: {effectIntensity}%</Text>
      </View>
    </EditorShell>
  )
}

const styles = StyleSheet.create({
  cta: { backgroundColor: ACCENT, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  canvasText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  row: { flexDirection: 'row', gap: 8 },
  controlBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  controlText: { color: '#fff', fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 999, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 10, paddingVertical: 6 },
  chipActive: { borderColor: ACCENT, backgroundColor: 'rgba(168,85,247,0.2)' },
  chipText: { color: '#fff', fontSize: 12 },
  intensity: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
})
