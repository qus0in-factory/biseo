import type { TimelineItem as T } from '../domain/timeline'

export function createRecoveryRefs() {
  let items: T[] = []
  let update = (_: T) => {}
  let workspaceId: string | null = null
  let generation = 0
  return {
    refresh(next: T[], apply: (i: T) => void, workspace: string | null) {
      if (workspaceId !== workspace) generation++
      workspaceId = workspace
      items = next
      update = apply
    },
    getItems: () => items,
    getUpdate: () => {
      const started = generation
      return (item: T) => {
        if (started === generation) update(item)
      }
    },
  }
}
