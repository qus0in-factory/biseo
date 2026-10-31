import { create } from 'zustand'
import { parsePaneListExpanded } from '../domain/collapsedPanes'
import r from '../resources.json'

function initialExpanded() {
  try { return parsePaneListExpanded(localStorage.getItem(r.paneListExpandedStorageKey)) }
  catch { return false }
}

export const usePaneListStore = create<{ expanded: boolean; toggle: () => void }>((set) => ({
  expanded: initialExpanded(),
  toggle: () => set(state => {
    const expanded = !state.expanded
    try { localStorage.setItem(r.paneListExpandedStorageKey, String(expanded)) } catch {}
    return { expanded }
  }),
}))
