import type { PaneSummary } from '../domain/timeline'
import { PinnedPaneList } from './PinnedPaneList'
import { RestPaneList } from './RestPaneList'

type P = {
  a: PaneSummary[]
  b: PaneSummary[]
  s: string | null
  p: string[]
  t: (id: string) => void
  c: (id: string) => void
  r: (id: string) => (el: HTMLLIElement | null) => void
}

export function PanesViewLayout({ a, b, s, p, t, c, r }: P) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      {a.length > 0 && <PinnedPaneList panes={a} selectedId={s} onToggle={t} onSelect={c} register={r} />}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <RestPaneList panes={b} selectedId={s} pinned={p} onToggle={t} onSelect={c} register={r} />
      </div>
    </div>
  )
}
