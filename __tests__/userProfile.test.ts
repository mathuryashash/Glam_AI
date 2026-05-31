/**
 * 👤 Unit Tests — User Profile Storage (lib/userProfile.ts)
 * Tests: saveProfile, loadProfile, clearProfile
 * Uses mocked @react-native-async-storage/async-storage
 */

// Jest auto-mocks AsyncStorage via the moduleNameMapper in jest.config.js
// The jest-expo preset provides a default in-memory mock.

import { saveProfile, loadProfile, clearProfile, type UserProfile } from '@/lib/userProfile'

const mockProfile: UserProfile = {
  name: 'Alex Star',
  birthData: {
    year: 1992,
    month: 5,
    day: 15,
    hour: 10,
    minute: 30,
    lat: 28.6139,
    lng: 77.209,
    timezone: 5.5,
  },
  sunSign: 'Taurus',
  moonSign: 'Libra',
  risingSign: 'Gemini',
  savedAt: new Date().toISOString(),
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}))

import AsyncStorage from '@react-native-async-storage/async-storage'

describe('saveProfile', () => {
  beforeEach(() => jest.clearAllMocks())

  it('calls AsyncStorage.setItem with correct key and JSON string', async () => {
    await saveProfile(mockProfile)
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'nebula_user_profile',
      JSON.stringify(mockProfile)
    )
  })

  it('does not throw on successful save', async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined)
    await expect(saveProfile(mockProfile)).resolves.toBeUndefined()
  })
})

describe('loadProfile', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns null when storage is empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null)
    const result = await loadProfile()
    expect(result).toBeNull()
  })

  it('returns parsed profile when data exists', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockProfile))
    const result = await loadProfile()
    expect(result).toEqual(mockProfile)
  })

  it('returns null when stored JSON is corrupt', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('{{not valid json}}')
    const result = await loadProfile()
    expect(result).toBeNull()
  })

  it('uses the correct storage key', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null)
    await loadProfile()
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('nebula_user_profile')
  })
})

describe('clearProfile', () => {
  beforeEach(() => jest.clearAllMocks())

  it('calls AsyncStorage.removeItem with the correct key', async () => {
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(undefined)
    await clearProfile()
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('nebula_user_profile')
  })

  it('does not throw', async () => {
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(undefined)
    await expect(clearProfile()).resolves.toBeUndefined()
  })
})
