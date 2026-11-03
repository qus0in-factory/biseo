import { create } from 'zustand'
import { connectionStatus, type ConnectionStatus } from '../domain/connectionStatus'

export interface UiState {
  drawerOpen: boolean
  selectedPaneId: string | null
  connection: ConnectionStatus
  workspaceId: string | null
  workspaceLabel: string | null
  setDrawerOpen: (open: boolean) => void
  toggleDrawer: () => void
  setSelectedPaneId: (id: string | null) => void
  setOnline: (ok: boolean) => void
  setWorkspaceId: (id: string | null) => void
  setWorkspaceLabel: (label: string | null) => void
}

export const useUiStore = create<UiState>((set) => ({
  drawerOpen: false,
  selectedPaneId: null,
  connection: 'connecting',
  workspaceId: null,
  workspaceLabel: null,
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  setSelectedPaneId: (id) => set({ selectedPaneId: id }),
  setOnline: (ok) => set((s) => ({ connection: connectionStatus(ok, s.connection === 'connected') })),
  setWorkspaceId: (id) => set({ workspaceId: id }),
  setWorkspaceLabel: (label) => set({ workspaceLabel: label }),
}))
