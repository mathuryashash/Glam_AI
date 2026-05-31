import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { EditorShell, editorCardStyles } from '@/components/editor/EditorShell'
import { MediaPreview } from '@/components/editor/MediaPreview'
import { Text } from '@/components/ui/Text'
import { useProjectStore } from '@/lib/editor/projectStore'
import { ACCENT, BORDER, ERROR } from '@/lib/theme'

export default function HistoryScreen() {
  const projects = useProjectStore((state) => state.projects)
  const selectProject = useProjectStore((state) => state.selectProject)
  const removeProject = useProjectStore((state) => state.removeProject)

  if (projects.length === 0) {
    return (
      <EditorShell title="History Gallery" subtitle="Projects and snapshots appear here after your first import.">
        <Pressable style={styles.cta} onPress={() => router.push('/(editor)/import')}>
          <Text style={styles.ctaText}>Create First Project</Text>
        </Pressable>
      </EditorShell>
    )
  }

  return (
    <EditorShell title="History Gallery" subtitle="Re-open serialized edit stacks and regenerate exports instantly.">
      {projects.map((project) => (
        <View key={project.id} style={editorCardStyles.card}>
          <View style={styles.thumb}>
            <MediaPreview
              uri={project.sourceUri}
              mediaType={project.mediaType}
              editStack={project.editStack}
              showEditBadge={false}
            />
          </View>
          <Text style={editorCardStyles.cardTitle}>{project.title}</Text>
          <Text style={editorCardStyles.cardMeta}>
            {project.mediaType.toUpperCase()} • {project.exports.length} exports • Updated{' '}
            {new Date(project.updatedAt).toLocaleString()}
          </Text>
          <View style={styles.row}>
            <Pressable
              style={styles.actionBtn}
              onPress={() => {
                selectProject(project.id)
                router.push(project.mediaType === 'photo' ? '/(editor)/photo' : '/(editor)/video')
              }}
            >
              <Text style={styles.actionText}>Re-open</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={() => removeProject(project.id)}>
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </EditorShell>
  )
}

const styles = StyleSheet.create({
  thumb: {
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cta: { backgroundColor: ACCENT, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  row: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  deleteBtn: { borderColor: ERROR, backgroundColor: 'rgba(248,113,113,0.08)' },
  deleteText: { color: '#fecaca' },
})
