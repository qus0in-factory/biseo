import { useState } from 'react'
import type { WorkspaceApiPort } from '../domain/ports'
import { isWorkspaceSelectionPending } from './workspaceSelectionGuard'
import { chooseWorkspaceTab } from './workspaceTabSelect'
import type { WorkspaceSelector } from './workspaceSelectionLink'

type Store = Parameters<typeof chooseWorkspaceTab>[4]

export const useWorkspaceTabChoice = (
 api: WorkspaceApiPort,
 selector: WorkspaceSelector | null | undefined,
 current: string | null,
 store: Store,
) => {
 const [target, setTarget] = useState<string | null>(null)
 const [error, setError] = useState<string | null>(null)
 const choose = (id: string) => {
  if (id === current || isWorkspaceSelectionPending()) return
  setTarget(id)
  void chooseWorkspaceTab(api, selector, id, current, store, setError)
   .finally(() => setTarget(null))
 }
 return { target, error, choose }
}
