import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { CanvasContainer } from '@/components/editor/CanvasContainer'
import { MediaPreview } from '@/components/editor/MediaPreview'
import { EditorShell, editorCardStyles } from '@/components/editor/EditorShell'
import { Text } from '@/components/ui/Text'
import { useActiveProject, useProjectStore } from '@/lib/editor/projectStore'
import {
  BG_TEMPLATES,
  RETOUCH_PRESETS,
  applyRetouchPreset,
  selectBackgroundTemplate,
  setObjectRemovalMask,
  toggleBackgroundRemoval,
} from '@/lib/editor/photoPipeline'
import { ACCENT, BORDER } from '@/lib/theme'

export default function PhotoScreen() {
  const project = useActiveProject()
  const updateEditStack = useProjectStore((state) => state.updateEditStack)

  if (!project) {
    return (
      <EditorShell title="Photo AI" subtitle="Start by importing a photo.">
        <Pressable style={styles.emptyCta} onPress={() => router.push('/(editor)/import')}>
          <Text style={styles.emptyCtaText}>Import Media</Text>
        </Pressable>
      </EditorShell>
    )
  }

  return (
    <EditorShell
      title="Photo AI"
      subtitle="Retouch presets and template previews. Demo mode — no cloud AI or pixel-perfect removal."
    >
      <CanvasContainer aspect="portrait" label="Live preview — edits apply instantly">
        <MediaPreview uri={project.sourceUri} mediaType={project.mediaType} editStack={project.editStack} />
      </CanvasContainer>

      <View style={editorCardStyles.card}>
        <Text style={editorCardStyles.cardTitle}>Retouch Presets</Text>
        <View style={styles.chips}>
          {RETOUCH_PRESETS.map((preset) => {
            const active = project.editStack.retouchPreset === preset.id
            return (
              <Pressable
                key={preset.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => updateEditStack(project.id, applyRetouchPreset(project, preset.id))}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{preset.label}</Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <View style={editorCardStyles.card}>
        <Text style={editorCardStyles.cardTitle}>Background (template preview · demo)</Text>
        {project.mediaType !== 'photo' ? (
          <Text style={editorCardStyles.cardMeta}>
            Template backgrounds work on photos. Import a still image, or use Video filters for clips.
          </Text>
        ) : (
          <Pressable
            style={styles.rowAction}
            onPress={() => updateEditStack(project.id, toggleBackgroundRemoval(project, !project.editStack.backgroundRemoved))}
          >
            <Text style={styles.rowActionText}>
              {project.editStack.backgroundRemoved ? 'Disable background swap' : 'Enable background swap'}
            </Text>
          </Pressable>
        )}
        <View style={styles.chips}>
          {BG_TEMPLATES.map((template) => (
            <Pressable
              key={template.id}
              style={styles.chip}
              onPress={() => updateEditStack(project.id, selectBackgroundTemplate(project, template.id))}
            >
              <Text style={styles.chipText}>{template.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={editorCardStyles.card}>
        <Text style={editorCardStyles.cardTitle}>Object cleanup (marker · demo)</Text>
        <Text style={editorCardStyles.cardMeta}>
          Places a cleanup marker in project state — not inpainting or cloud removal.
        </Text>
        <Pressable
          style={styles.rowAction}
          onPress={() => updateEditStack(project.id, setObjectRemovalMask(project, `mask-${Date.now()}`))}
        >
          <Text style={styles.rowActionText}>Place cleanup marker (demo)</Text>
        </Pressable>
      </View>
    </EditorShell>
  )
}

const styles = StyleSheet.create({
  canvasLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  emptyCta: { backgroundColor: ACCENT, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  emptyCtaText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  chipText: { color: '#fff', fontSize: 12 },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  rowAction: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  rowActionText: { color: '#fff', fontSize: 13 },
})
