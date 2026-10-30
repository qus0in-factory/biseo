import { create } from 'zustand'
import { parsePinnedPanes } from '../domain/pinnedPanes'
import r from '../resources.json'

const initialPinned = (() => {
  try {
    return typeof window === 'undefined' ? [] : parsePinnedPanes(window.localStorage.getItem(r.pinnedStorageKey))
  } catch {
    return []
  }
})()

export interface UiState {
  drawerOpen: boolean
  selectedPaneId: string | null
  pinned: string[]
  setDrawerOpen: (open: boolean) => void
  toggleDrawer: () => void
  setSelectedPaneId: (id: string | null) => void
  setPinned: (ids: string[]) => void
}

export const useUiStore = create<UiState>((set) => ({
  drawerOpen: false,
  selectedPaneId: null,
  pinned: initialPinned,
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  setSelectedPaneId: (id) => set({ selectedPaneId: id }),
  setPinned: (pinned) => set({ pinned }),
}))
