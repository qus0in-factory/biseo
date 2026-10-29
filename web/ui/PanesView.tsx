import { useEffect, useRef, useState } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { PaneItem } from './PaneItem'
import {
  parsePinnedPanes,
  serializePinnedPanes,
  prunePinnedPanes,
  togglePinnedPane,
  partitionPanes,
} from '../domain/pinnedPanes'
import r from '../resources.json'

type Props = {
  panes: PaneSummary[]
  selectedId: string | null
  onSelect: (paneId: string) => void
  storageKey?: string
}

export function PanesView({ panes, selectedId, onSelect, storageKey }: Props) {
  const key = storageKey ?? r.pinnedStorageKey
  const [pinned, setPinned] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return parsePinnedPanes(window.localStorage.getItem(key))
  })

  useEffect(() => {
    const available = new Set(panes.map((pane) => pane.paneId))
    setPinned((prev) => {
      const next = prunePinnedPanes(prev, available)
      if (next.length !== prev.length || next.some((id, index) => id !== prev[index])) {
        try {
          window.localStorage.setItem(key, serializePinnedPanes(next))
        } catch {
          // ignore storage errors
        }
        return next
      }
      return prev
    })
  }, [panes, key])

  const updatePinned = (next: string[]) => {
    setPinned(next)
    try {
      window.localStorage.setItem(key, serializePinnedPanes(next))
    } catch {
      // ignore storage errors
    }
  }

  const { pinned: pinnedPanes, rest } = partitionPanes(panes, pinned)
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map())

  useEffect(() => {
    if (!selectedId) return
    const element = itemRefs.current.get(selectedId)
    element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedId, panes])

  if (panes.length === 0) return <p className="text-sm text-muted-foreground">{r.emptyPanes}</p>

  const registerRef = (paneId: string) => (element: HTMLLIElement | null) => {
    if (element) itemRefs.current.set(paneId, element)
    else itemRefs.current.delete(paneId)
  }

  return (
    <div className="flex flex-col gap-2">
      {pinnedPanes.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {pinnedPanes.map((pane) => (
            <PaneItem
              key={pane.paneId}
              ref={registerRef(pane.paneId)}
              item={pane}
              active={pane.paneId === selectedId}
              pinned
              onTogglePin={() => updatePinned(togglePinnedPane(pinned, pane.paneId))}
              onClick={() => onSelect(pane.paneId)}
            />
          ))}
        </ul>
      )}
      <div className="max-h-[352px] overflow-y-auto">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {rest.map((pane) => (
            <PaneItem
              key={pane.paneId}
              ref={registerRef(pane.paneId)}
              item={pane}
              active={pane.paneId === selectedId}
              pinned={pinned.includes(pane.paneId)}
              onTogglePin={() => updatePinned(togglePinnedPane(pinned, pane.paneId))}
              onClick={() => onSelect(pane.paneId)}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
