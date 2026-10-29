import { create } from 'zustand'
import type { TabName } from '../domain/schemas/routeParams'

export interface UiState {
  drawerOpen: boolean
  activeTab: TabName
  selectedPaneId: string | null
  setDrawerOpen: (open: boolean) => void
  toggleDrawer: () => void
  setActiveTab: (tab: TabName) => void
  setSelectedPaneId: (id: string | null) => void
}

export const useUiStore = create<UiState>((set) => ({
  drawerOpen: false,
  activeTab: 'panels',
  selectedPaneId: null,
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedPaneId: (id) => set({ selectedPaneId: id }),
}))
