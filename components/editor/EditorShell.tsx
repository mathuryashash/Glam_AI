import { ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/Text'
import { BG, BORDER, TEXT_SECONDARY } from '@/lib/theme'

type EditorShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  scroll?: boolean
}

export function EditorShell({ title, subtitle, children, scroll = true }: EditorShellProps) {
  const content = (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  )

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <LinearGradient colors={['#080612', '#0e0a20', '#080612']} style={StyleSheet.absoluteFillObject} />
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  )
}

export const editorCardStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 14,
    gap: 8,
  },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cardMeta: { color: TEXT_SECONDARY, fontSize: 12, lineHeight: 18 },
})

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scrollContent: { paddingBottom: 110 },
  content: { paddingHorizontal: 18, paddingTop: 8, gap: 14 },
  header: { gap: 5, marginBottom: 4 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  subtitle: { color: TEXT_SECONDARY, fontSize: 13, lineHeight: 19 },
})
