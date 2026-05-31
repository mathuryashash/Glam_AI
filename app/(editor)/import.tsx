import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { EditorShell, editorCardStyles } from '@/components/editor/EditorShell'
import { Text } from '@/components/ui/Text'
import { pickPhotoOrVideo } from '@/hooks/editor/useMediaImport'
import { useProjectStore } from '@/lib/editor/projectStore'
import { ACCENT, ERROR } from '@/lib/theme'

export default function ImportScreen() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const createProject = useProjectStore((state) => state.createProject)

  const handleImport = async () => {
    setLoading(true)
    setError(null)
    try {
      const asset = await pickPhotoOrVideo()
      if (!asset) return
      createProject({
        sourceUri: asset.uri,
        mediaType: asset.mediaType,
        title: asset.fileName,
        thumbnailUri: asset.thumbnailUri,
      })
      router.replace(asset.mediaType === 'photo' ? '/(editor)/photo' : '/(editor)/video')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <EditorShell
      title="Import Media"
      subtitle="Use local media only; project state stores file URIs + edits, never raw media blobs."
    >
      <Pressable style={styles.cta} onPress={handleImport} disabled={loading}>
        <Text style={styles.ctaText}>{loading ? 'Importing...' : 'Pick from Gallery'}</Text>
      </Pressable>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={editorCardStyles.card}>
        <Text style={editorCardStyles.cardTitle}>Import Rules</Text>
        <Text style={editorCardStyles.cardMeta}>• Photo and video supported</Text>
        <Text style={editorCardStyles.cardMeta}>• Video clips should stay under 10 seconds for stable preview/export</Text>
        <Text style={editorCardStyles.cardMeta}>• Re-editable history snapshots save automatically</Text>
      </View>
    </EditorShell>
  )
}

const styles = StyleSheet.create({
  cta: { backgroundColor: ACCENT, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  errorBox: {
    borderColor: ERROR,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(248,113,113,0.1)',
    padding: 12,
  },
  errorText: { color: '#fecaca', fontSize: 12 },
})
