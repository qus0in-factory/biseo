import { useSyncExternalStore } from 'react'
import { isWorkspaceSelectionPending, subscribeWorkspaceSelection } from './workspaceSelectionGuard'

export const useWorkspaceSelectionPending = () => useSyncExternalStore(
 subscribeWorkspaceSelection,
 isWorkspaceSelectionPending,
 isWorkspaceSelectionPending,
)
