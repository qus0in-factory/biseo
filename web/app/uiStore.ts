import { create } from 'zustand'

export interface UiState {
  drawerOpen: boolean
  selectedPaneId: string | null
  setDrawerOpen: (open: boolean) => void
  toggleDrawer: () => void
  setSelectedPaneId: (id: string | null) => void
}

export const useUiStore = create<UiState>((set) => ({
  drawerOpen: false,
  selectedPaneId: null,
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  setSelectedPaneId: (id) => set({ selectedPaneId: id }),
}))
