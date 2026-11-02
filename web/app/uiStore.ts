import { create } from 'zustand'
import { connectionStatus, type ConnectionStatus } from '../domain/connectionStatus'

export interface UiState {
  drawerOpen: boolean
  selectedPaneId: string | null
  connection: ConnectionStatus
  setDrawerOpen: (open: boolean) => void
  toggleDrawer: () => void
  setSelectedPaneId: (id: string | null) => void
  setOnline: (ok: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  drawerOpen: false,
  selectedPaneId: null,
  connection: 'connecting',
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  setSelectedPaneId: (id) => set({ selectedPaneId: id }),
  setOnline: (ok) => set((s) => ({ connection: connectionStatus(ok, s.connection === 'connected') })),
}))
