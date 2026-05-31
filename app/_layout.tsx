// Production judging build: entry is app/index.tsx → Redirect to /(editor).
// Legacy Nebula providers (PostHog, RevenueCat, Sentry) are template residue; the demo
// surface is editor-only. Set EXPO_PUBLIC_EDITOR_ONLY=true to skip heavy third-party init.

import React, { useEffect } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { Stack, useNavigationContainerRef, usePathname } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'

const EDITOR_ONLY = process.env.EXPO_PUBLIC_EDITOR_ONLY === 'true'

import * as Sentry from '@sentry/react-native'

const routingInstrumentation = EDITOR_ONLY ? null : Sentry.reactNavigationIntegration()

if (!EDITOR_ONLY) {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
    environment: __DEV__ ? 'development' : 'production',
    enabled: !__DEV__ && !!process.env.EXPO_PUBLIC_SENTRY_DSN,
    integrations: routingInstrumentation ? [routingInstrumentation] : [],
    tracesSampleRate: 0,
  })
}

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter'
import { ThemeProvider, DarkTheme } from '@react-navigation/native'
import { PostHogProvider } from 'posthog-react-native'
import { I18nextProvider } from 'react-i18next'

import { posthog, isPostHogEnabled, track } from '@/lib/analytics'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { ToastProvider } from '@/contexts/ToastContext'
import i18n, { initI18n } from '@/lib/i18n'
import OfflineBanner from '@/components/OfflineBanner'
import OfflineOverlay from '@/components/OfflineOverlay'
import { Text } from '@/components/ui/Text'
import { BG } from '@/lib/theme'

// ─── Error boundary ───────────────────────────────────────────────────────────
// React requires a class component to catch render errors — hooks cannot do this.

function ErrorFallback() {
  return (
    <View style={eb.container}>
      <Text style={eb.title}>Something went wrong</Text>
      <Text style={eb.subtitle}>Please close and reopen the app.</Text>
    </View>
  )
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, info)
    if (!EDITOR_ONLY) {
      Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
    }
  }

  render() {
    if (this.state.hasError) return <ErrorFallback />
    return this.props.children
  }
}

const eb = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: BG,
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', lineHeight: 22 },
})

// ─── Theme ────────────────────────────────────────────────────────────────────

const customDarkTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: BG },
}

// ─── Conditional PostHog provider ─────────────────────────────────────────────
// PostHogProvider requires a valid client instance. When the API key is missing
// we skip the provider entirely so no errors are thrown.

function MaybePostHogProvider({ children }: { children: React.ReactNode }) {
  if (EDITOR_ONLY || !isPostHogEnabled || !posthog) {
    return <>{children}</>
  }
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

// ─── Screen tracking ─────────────────────────────────────────────────────────
// Rendered inside the navigator so usePathname has routing context.

function ScreenTracker() {
  const pathname = usePathname()
  useEffect(() => {
    if (!EDITOR_ONLY) {
      track('screen_viewed', { screen: pathname })
    }
  }, [pathname])
  return null
}

function ShellProviders({ children }: { children: React.ReactNode }) {
  const inner = (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: BG }}>
            <BottomSheetModalProvider>
              <StatusBar
                style="light"
                translucent={Platform.OS === 'android'}
                backgroundColor={Platform.OS === 'android' ? BG : undefined}
              />
              <ThemeProvider value={customDarkTheme}>
                <View style={{ flex: 1, backgroundColor: BG }}>
                  {children}
                  {!EDITOR_ONLY ? (
                    <>
                      <OfflineBanner />
                      <OfflineOverlay />
                    </>
                  ) : null}
                </View>
              </ThemeProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ToastProvider>
    </QueryClientProvider>
  )

  if (EDITOR_ONLY) {
    return inner
  }

  return <SubscriptionProvider>{inner}</SubscriptionProvider>
}

// ─── Root layout ──────────────────────────────────────────────────────────────

function RootLayout() {
  const navigationRef = useNavigationContainerRef()
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  })

  const [i18nReady, setI18nReady] = React.useState(false)

  useEffect(() => {
    initI18n()
      .then(() => setI18nReady(true))
      .catch((err) => {
        console.warn('[i18n] Failed to initialize:', err)
        setI18nReady(true) // Unblock UI even if translations fail
      })
  }, [])

  useEffect(() => {
    if (routingInstrumentation && navigationRef.current) {
      routingInstrumentation.registerNavigationContainer(navigationRef)
    }
  }, [navigationRef])

  if (!fontsLoaded || !i18nReady) {
    return <View style={{ flex: 1, backgroundColor: BG }} />
  }

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <MaybePostHogProvider>
          <ShellProviders>
            <Stack ref={navigationRef} screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: BG } }}>
              <Stack.Screen name="(editor)" />
              <Stack.Screen name="index" />
            </Stack>
            {!EDITOR_ONLY ? <ScreenTracker /> : null}
          </ShellProviders>
        </MaybePostHogProvider>
      </I18nextProvider>
    </ErrorBoundary>
  )
}

export default EDITOR_ONLY ? RootLayout : Sentry.wrap(RootLayout)
