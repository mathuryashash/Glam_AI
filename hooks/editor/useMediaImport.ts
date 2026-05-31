import * as ImagePicker from 'expo-image-picker'
import type { MediaType } from '@/lib/editor/types'

export async function pickPhotoOrVideo() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!permission.granted) {
    throw new Error('Media library permission is required to import files.')
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    mediaTypes: ['images', 'videos'],
    quality: 1,
  })

  if (result.canceled || result.assets.length === 0) return null
  const asset = result.assets[0]
  const mediaType: MediaType = asset.type === 'video' ? 'video' : 'photo'

  return {
    uri: asset.uri,
    mediaType,
    thumbnailUri: asset.uri,
    fileName: asset.fileName ?? 'Imported Asset',
  }
}
