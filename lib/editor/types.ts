export type MediaType = 'photo' | 'video'
export type ExportFormat = 'story' | 'carousel-square' | 'carousel-portrait'

export interface VideoTrim {
  start: number
  end: number
}

export interface EditStack {
  retouchPreset?: string
  backgroundRemoved: boolean
  backgroundTemplateId?: string
  objectRemovalMaskId?: string
  videoTrim: VideoTrim
  appliedFilters: string[]
  effectIntensity: number
}

export interface Project {
  id: string
  title: string
  sourceUri: string
  mediaType: MediaType
  createdAt: number
  updatedAt: number
  thumbnailUri?: string
  exports: Array<{
    id: string
    format: ExportFormat
    uri: string
    createdAt: number
  }>
  editStack: EditStack
}
