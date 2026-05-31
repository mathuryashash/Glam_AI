# Publishing Glam Studio AI

You do **not** need MMKV to publish. **AsyncStorage** works in production builds (App Store / Play Store). MMKV is optional for faster storage if you later switch to a custom dev build.

## Recommended path: EAS Build + Store Submit

### 1. Prerequisites

- [Expo account](https://expo.dev/signup)
- Apple Developer account ($99/year) for iOS
- Google Play Developer account ($25 one-time) for Android
- EAS CLI:

```bash
npm install -g eas-cli
eas login
```

### 2. Configure the project

From the app folder:

```bash
cd "d:\8xengineer\the ai video app"
eas build:configure
```

Update `app.json` with your final app name, bundle IDs, and icons before building.

### 3. Create production builds

**Android (AAB for Play Store):**

```bash
eas build --platform android --profile production
```

**iOS (for App Store):**

```bash
eas build --platform ios --profile production
```

### 4. Submit to stores

```bash
eas submit --platform android
eas submit --platform ios
```

Follow the prompts for store credentials.

## Testing a production-like build on your phone

Expo Go is for development only. To test the real published binary:

```bash
eas build --profile preview --platform android
```

Install the APK/AAB link from the Expo dashboard on your device.

Or local dev client:

```bash
npx expo prebuild
npx expo run:android
```

## Optional: add MMKV in a custom build

MMKV does **not** work in Expo Go. It **does** work after `eas build` or `expo run:*` because native code is compiled in.

```bash
npm install react-native-mmkv@2.12.2
```

Then swap AsyncStorage back to MMKV in `lib/editor/projectStore.ts` only when you are no longer using Expo Go.

## Checklist before submit

- [ ] App icons and splash (`assets/`)
- [ ] Privacy policy URL (required by both stores)
- [ ] Screenshots (see `docs/judging/SCREENSHOTS.md`)
- [ ] Store listing copy
- [ ] Test import → edit → export → history on a preview build
