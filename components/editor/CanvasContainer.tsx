import { ReactNode, useMemo } from 'react'
import { LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from 'react-native'
import { Text } from '@/components/ui/Text'
import { BORDER, TEXT_SECONDARY } from '@/lib/theme'

export type CanvasAspect = 'story' | 'square' | 'portrait'

const ASPECT_RATIO: Record<CanvasAspect, number> = {
  story: 9 / 16,
  square: 1,
  portrait: 4 / 5,
}

type CanvasContainerProps = {
  aspect: CanvasAspect
  label?: string
  children?: ReactNode
  onLayoutChange?: (size: { width: number; height: number }) => void
}

export function CanvasContainer({ aspect, label, children, onLayoutChange }: CanvasContainerProps) {
  const { width: windowWidth } = useWindowDimensions()
  const canvasWidth = useMemo(() => Math.min(windowWidth - 36, 380), [windowWidth])
  const canvasHeight = canvasWidth / ASPECT_RATIO[aspect]

  const handleLayout = (event: LayoutChangeEvent) => {
    onLayoutChange?.({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    })
  }

  return (
    <View style={styles.wrap}>
      <View style={[styles.canvas, { width: canvasWidth, height: canvasHeight }]} onLayout={handleLayout}>
        {children}
      </View>
      {label ? <Text style={styles.caption}>{label}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: 8, alignItems: 'center' },
  canvas: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#0a0814',
    overflow: 'hidden',
  },
  caption: { color: TEXT_SECONDARY, fontSize: 12 },
})
