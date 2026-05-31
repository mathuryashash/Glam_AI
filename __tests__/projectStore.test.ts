jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

import { useProjectStore } from '@/lib/editor/projectStore'

describe('projectStore', () => {
  beforeEach(() => {
    useProjectStore.setState({ projects: [], activeProjectId: null })
  })

  it('creates and selects a project', () => {
    const id = useProjectStore.getState().createProject({
      sourceUri: 'file://asset.jpg',
      mediaType: 'photo',
      title: 'Asset',
    })

    const state = useProjectStore.getState()
    expect(state.projects).toHaveLength(1)
    expect(state.activeProjectId).toBe(id)
    expect(state.projects[0].sourceUri).toBe('file://asset.jpg')
  })

  it('adds and removes filters', () => {
    const id = useProjectStore.getState().createProject({
      sourceUri: 'file://asset.jpg',
      mediaType: 'photo',
      title: 'Asset',
    })

    useProjectStore.getState().addFilter(id, 'vivid')
    useProjectStore.getState().removeFilter(id, 'vivid')

    const project = useProjectStore.getState().projects.find((p) => p.id === id)
    expect(project?.editStack.appliedFilters).toEqual([])
  })

  it('stores export records', () => {
    const id = useProjectStore.getState().createProject({
      sourceUri: 'file://asset.mp4',
      mediaType: 'video',
      title: 'Clip',
    })

    useProjectStore.getState().saveExport(id, 'story', 'file://render/story.json')
    const project = useProjectStore.getState().projects.find((p) => p.id === id)
    expect(project?.exports).toHaveLength(1)
    expect(project?.exports[0].format).toBe('story')
  })
})
