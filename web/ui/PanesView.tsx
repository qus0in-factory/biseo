import type { PaneSummary } from '../domain/timeline'
import { usePanesView } from './usePanesView'
import { PanesViewLayout } from './PanesViewLayout'
import r from '../resources.json'

type P = { panes: PaneSummary[]; selectedId: string | null; onSelect: (id: string) => void; storageKey?: string }

export function PanesView(p: P) {
  const v = usePanesView(p)
  if (!v) return <p className="text-sm text-muted-foreground">{r.emptyPanes}</p>
  return <PanesViewLayout a={v.pinnedPanes} b={v.rest} s={p.selectedId} p={v.pinned} t={v.toggle} c={p.onSelect} r={v.register} />
}
