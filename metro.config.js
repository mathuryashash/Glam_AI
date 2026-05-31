const { getSentryExpoConfig } = require('@sentry/react-native/metro')

const config = getSentryExpoConfig(__dirname)

// blockList: optional @sentry/cli-* platform binaries are not installed on Windows; exclude them so Metro file watching does not fail.
const sentryCliOptional =
  /node_modules[\\/]@sentry[\\/]cli-(?:darwin|linux(?:-arm64|-arm|-i686|-x64)?|win32-(?:arm64|i686))/

const existing = config.resolver?.blockList
config.resolver = {
  ...config.resolver,
  blockList: Array.isArray(existing)
    ? [...existing, sentryCliOptional]
    : existing
      ? [existing, sentryCliOptional]
      : [sentryCliOptional],
}

module.exports = config
