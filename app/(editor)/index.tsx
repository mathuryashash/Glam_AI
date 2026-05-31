import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { CanvasContainer } from '@/components/editor/CanvasContainer'
import { EditorShell, editorCardStyles } from '@/components/editor/EditorShell'
import { MediaPreview } from '@/components/editor/MediaPreview'
import { Text } from '@/components/ui/Text'
import { ACCENT, ACCENT_DIM } from '@/lib/theme'
import { useProjectStore } from '@/lib/editor/projectStore'

export default function EditorHomeScreen() {
  const projects = useProjectStore((state) => state.projects)
  const activeProjectId = useProjectStore((state) => state.activeProjectId)
  const activeProject = projects.find((project) => project.id === activeProjectId)

  return (
    <EditorShell
      title="Glam Studio AI"
      subtitle="Studio previews for retouching, template backgrounds, and short clips. Demo mode — local previews, not pixel-perfect AI removal."
    >
      <Pressable style={styles.primaryCta} onPress={() => router.push('/(editor)/import')}>
        <Text style={styles.primaryText}>Import Photo or Video</Text>
      </Pressable>

      {activeProject ? (
        <CanvasContainer aspect="square" label={activeProject.title}>
          <MediaPreview
            uri={activeProject.sourceUri}
            mediaType={activeProject.mediaType}
            editStack={activeProject.editStack}
          />
        </CanvasContainer>
      ) : (
        <View style={editorCardStyles.card}>
          <Text style={editorCardStyles.cardTitle}>Current Session</Text>
          <Text style={editorCardStyles.cardMeta}>No active project yet. Import one file to start editing.</Text>
        </View>
      )}

      <View style={styles.grid}>
        <Pressable style={styles.gridCard} onPress={() => router.push('/(editor)/photo')}>
          <Text style={styles.gridTitle}>Photo AI</Text>
          <Text style={styles.gridMeta}>Retouch presets + template backgrounds + cleanup markers (demo)</Text>
        </Pressable>
        <Pressable style={styles.gridCard} onPress={() => router.push('/(editor)/video')}>
          <Text style={styles.gridTitle}>Video Edit</Text>
          <Text style={styles.gridMeta}>Trim window + filter stacks + intensity</Text>
        </Pressable>
        <Pressable style={styles.gridCard} onPress={() => router.push('/(editor)/export')}>
          <Text style={styles.gridTitle}>Export Lab</Text>
          <Text style={styles.gridMeta}>Story 9:16 + carousel presets → JSON recipes</Text>
        </Pressable>
        <Pressable style={styles.gridCard} onPress={() => router.push('/(editor)/history')}>
          <Text style={styles.gridTitle}>History</Text>
          <Text style={styles.gridMeta}>Re-open edits and saved recipe files</Text>
        </Pressable>
      </View>
    </EditorShell>
  )
}

const styles = StyleSheet.create({
  primaryCta: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ACCENT_DIM,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    gap: 6,
  },
  gridTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  gridMeta: { color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 17 },
})
