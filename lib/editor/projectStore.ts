import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { MediaType, Project, ExportFormat } from '@/lib/editor/types'

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function defaultEditStack() {
  return {
    backgroundRemoved: false,
    videoTrim: { start: 0, end: 10 },
    appliedFilters: [] as string[],
    effectIntensity: 65,
  }
}

type ProjectState = {
  activeProjectId: string | null
  projects: Project[]
  selectProject: (id: string) => void
  createProject: (params: { sourceUri: string; mediaType: MediaType; title?: string; thumbnailUri?: string }) => string
  updateEditStack: (projectId: string, patch: Partial<Project['editStack']>) => void
  addFilter: (projectId: string, filterId: string) => void
  removeFilter: (projectId: string, filterId: string) => void
  saveExport: (projectId: string, format: ExportFormat, uri: string) => void
  removeProject: (projectId: string) => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      activeProjectId: null,
      projects: [],
      selectProject: (id) => set({ activeProjectId: id }),
      createProject: ({ sourceUri, mediaType, title, thumbnailUri }) => {
        const now = Date.now()
        const projectId = makeId('project')
        const project: Project = {
          id: projectId,
          title: title ?? `Untitled ${mediaType}`,
          sourceUri,
          mediaType,
          createdAt: now,
          updatedAt: now,
          thumbnailUri,
          exports: [],
          editStack: defaultEditStack(),
        }
        set((state) => ({ projects: [project, ...state.projects], activeProjectId: projectId }))
        return projectId
      },
      updateEditStack: (projectId, patch) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  updatedAt: Date.now(),
                  editStack: { ...project.editStack, ...patch },
                }
              : project
          ),
        })),
      addFilter: (projectId, filterId) =>
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== projectId || project.editStack.appliedFilters.includes(filterId)) {
              return project
            }
            return {
              ...project,
              updatedAt: Date.now(),
              editStack: {
                ...project.editStack,
                appliedFilters: [...project.editStack.appliedFilters, filterId],
              },
            }
          }),
        })),
      removeFilter: (projectId, filterId) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  updatedAt: Date.now(),
                  editStack: {
                    ...project.editStack,
                    appliedFilters: project.editStack.appliedFilters.filter((f) => f !== filterId),
                  },
                }
              : project
          ),
        })),
      saveExport: (projectId, format, uri) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  updatedAt: Date.now(),
                  exports: [
                    {
                      id: makeId('export'),
                      format,
                      uri,
                      createdAt: Date.now(),
                    },
                    ...project.exports,
                  ],
                }
              : project
          ),
        })),
      removeProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== projectId),
          activeProjectId: state.activeProjectId === projectId ? null : state.activeProjectId,
        })),
    }),
    {
      name: 'editor-project-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeProjectId: state.activeProjectId,
        projects: state.projects,
      }),
    }
  )
)

export function useActiveProject() {
  return useProjectStore((state) => state.projects.find((project) => project.id === state.activeProjectId) ?? null)
}
