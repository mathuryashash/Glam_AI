import { StyleSheet, View, type ViewStyle } from 'react-native'
import { Image } from 'expo-image'
import { useVideoPlayer, VideoView } from 'expo-video'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import type { EditStack, MediaType } from '@/lib/editor/types'

const BG_GRADIENTS: Record<string, [string, string]> = {
  sunset: ['#fb923c', '#7c2d12'],
  neon: ['#22d3ee', '#6b21a8'],
  minimal: ['#f8fafc', '#cbd5e1'],
}

const RETOUCH_TINT: Record<string, string> = {
  natural: 'rgba(255, 220, 200, 0.08)',
  'soft-glow': 'rgba(255, 200, 255, 0.18)',
  studio: 'rgba(200, 220, 255, 0.14)',
}

const FILTER_TINT: Record<string, string> = {
  cinematic: 'rgba(20, 20, 40, 0.25)',
  vivid: 'rgba(255, 100, 50, 0.15)',
  dream: 'rgba(180, 120, 255, 0.2)',
  mono: 'rgba(128, 128, 128, 0.35)',
}

type MediaPreviewProps = {
  uri: string
  mediaType: MediaType
  editStack: EditStack
  style?: ViewStyle
  showEditBadge?: boolean
}

function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true
    p.muted = true
    p.play()
  })

  return <VideoView player={player} style={styles.mediaFill} contentFit="cover" nativeControls={false} />
}

export function MediaPreview({ uri, mediaType, editStack, style, showEditBadge = true }: MediaPreviewProps) {
  const bgSwap = editStack.backgroundRemoved && mediaType === 'photo'
  const bgKey = editStack.backgroundTemplateId ?? 'sunset'
  const bgColors = BG_GRADIENTS[bgKey] ?? BG_GRADIENTS.sunset
  const intensity = editStack.effectIntensity / 100

  return (
    <View style={[styles.root, style]}>
      {bgSwap ? <LinearGradient colors={bgColors} style={StyleSheet.absoluteFillObject} /> : null}

      <View style={bgSwap ? styles.cutoutFrame : styles.fullFrame}>
        {mediaType === 'video' ? (
          <VideoPreview uri={uri} />
        ) : (
          <Image
            source={{ uri }}
            style={styles.mediaFill}
            contentFit={bgSwap ? 'contain' : 'cover'}
            transition={200}
          />
        )}

        {editStack.retouchPreset ? (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFillObject, { backgroundColor: RETOUCH_TINT[editStack.retouchPreset] ?? 'transparent' }]}
          />
        ) : null}

        {editStack.appliedFilters.map((filter) => (
          <View
            key={filter}
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: FILTER_TINT[filter] ?? 'transparent', opacity: intensity },
            ]}
          />
        ))}
      </View>

      {bgSwap ? (
        <View pointerEvents="none" style={styles.bgBadge}>
          <Text style={styles.bgBadgeText}>Background replaced</Text>
        </View>
      ) : null}

      {editStack.objectRemovalMaskId ? (
        <View pointerEvents="none" style={styles.objectMask}>
          <Text style={styles.objectMaskText}>Object cleaned</Text>
        </View>
      ) : null}

      {showEditBadge && (editStack.retouchPreset || bgSwap) ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {editStack.retouchPreset ? `Retouch: ${editStack.retouchPreset}` : 'Edited'}
            {bgSwap ? ' • BG swap' : ''}
          </Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#0a0814',
  },
  fullFrame: {
    ...StyleSheet.absoluteFillObject,
  },
  cutoutFrame: {
    position: 'absolute',
    top: '8%',
    left: '8%',
    right: '8%',
    bottom: '8%',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'transparent',
  },
  mediaFill: {
    width: '100%',
    height: '100%',
  },
  objectMask: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(168,85,247,0.85)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  objectMaskText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  bgBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(168,85,247,0.9)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bgBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
})
