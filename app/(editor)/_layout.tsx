import { Tabs } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/Text'
import { ACCENT, BG, BORDER, TAB_INACTIVE } from '@/lib/theme'

function TabIcon({ glyph, label, focused }: { glyph: string; label: string; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.glyph, focused && styles.glyphFocused]}>{glyph}</Text>
      <Text
        style={[styles.label, focused && styles.labelFocused]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {label}
      </Text>
    </View>
  )
}

export default function EditorTabsLayout() {
  const insets = useSafeAreaInsets()
  const tabBarHeight = 58 + insets.bottom

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { height: tabBarHeight, paddingBottom: Math.max(insets.bottom, 8) }],
        tabBarItemStyle: styles.tabBarItem,
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(8,6,18,0.96)', '#080612']}
            style={[StyleSheet.absoluteFillObject, { borderTopColor: BORDER, borderTopWidth: 1 }]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon glyph="✦" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="photo"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon glyph="◉" label="Photo" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="video"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon glyph="▷" label="Video" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon glyph="☰" label="Past" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="export"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon glyph="⇪" label="Save" focused={focused} />,
        }}
      />
      <Tabs.Screen name="import" options={{ href: null }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: BG,
    borderTopWidth: 0,
    paddingTop: 6,
  },
  tabBarItem: {
    flex: 1,
    minWidth: 0,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    width: 64,
    maxWidth: 72,
  },
  glyph: { fontSize: 18, color: TAB_INACTIVE },
  glyphFocused: { color: ACCENT },
  label: {
    fontSize: 9,
    color: TAB_INACTIVE,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  labelFocused: { color: ACCENT },
})
