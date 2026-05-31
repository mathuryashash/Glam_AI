import {
  applyRetouchPreset,
  selectBackgroundTemplate,
  setObjectRemovalMask,
  toggleBackgroundRemoval,
} from '@/lib/editor/photoPipeline'
import { setEffectIntensity, setTrimWindow } from '@/lib/editor/videoPipeline'
import type { Project } from '@/lib/editor/types'

function mockProject(): Project {
  return {
    id: 'p1',
    title: 'Sample',
    sourceUri: 'file://demo.jpg',
    mediaType: 'photo',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    exports: [],
    editStack: {
      backgroundRemoved: false,
      videoTrim: { start: 0, end: 10 },
      appliedFilters: [],
      effectIntensity: 65,
    },
  }
}

describe('photoPipeline', () => {
  it('applies retouch preset', () => {
    const patch = applyRetouchPreset(mockProject(), 'natural')
    expect(patch.retouchPreset).toBe('natural')
  })

  it('toggles background removal', () => {
    const patch = toggleBackgroundRemoval(mockProject(), true)
    expect(patch.backgroundRemoved).toBe(true)
  })

  it('selects template and enables removal', () => {
    const patch = selectBackgroundTemplate(mockProject(), 'sunset')
    expect(patch.backgroundRemoved).toBe(true)
    expect(patch.backgroundTemplateId).toBe('sunset')
  })

  it('stores object removal mask id', () => {
    const patch = setObjectRemovalMask(mockProject(), 'mask-1')
    expect(patch.objectRemovalMaskId).toBe('mask-1')
  })
})

describe('videoPipeline', () => {
  it('keeps trim window in safe range', () => {
    const patch = setTrimWindow(mockProject(), -4, 24)
    expect(patch.videoTrim.start).toBe(0)
    expect(patch.videoTrim.end).toBe(10)
  })

  it('enforces at least one second duration', () => {
    const patch = setTrimWindow(mockProject(), 7, 7)
    expect(patch.videoTrim.end).toBeGreaterThan(patch.videoTrim.start)
  })

  it('clamps effect intensity', () => {
    expect(setEffectIntensity(mockProject(), 120).effectIntensity).toBe(100)
    expect(setEffectIntensity(mockProject(), -10).effectIntensity).toBe(0)
  })
})
