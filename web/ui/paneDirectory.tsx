import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { PaneSummary, TimelineItem } from '../domain/timeline'
import { resolveTargetName } from '../domain/targetName'

const PaneDirectory = createContext<readonly PaneSummary[]>([])

export function PaneDirectoryProvider({ panes, children }: { panes: readonly PaneSummary[]; children: ReactNode }) {
  return <PaneDirectory.Provider value={panes}>{children}</PaneDirectory.Provider>
}

export function useTargetName(item: TimelineItem): string {
  return resolveTargetName(item, useContext(PaneDirectory))
}
