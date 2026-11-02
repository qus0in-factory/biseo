import type { KeyboardEvent } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { PaneMeta } from './PaneMeta'
import { PaneStatusBadge } from './PaneStatusBadge'
import { paneSelectClass } from './paneSelectClass'

type P = { item: PaneSummary; active: boolean; onClick: () => void }
const r1 = 'flex w-full min-w-0 items-center justify-between gap-2'
const nm = 'min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm'
const r2 = 'flex w-full min-w-0 items-center justify-start gap-1.5 overflow-hidden'

export function PaneSelectButton({ item, active, onClick }: P) {
  const k = (e: KeyboardEvent) => {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick() }
  }
  return (
    <div role="button" tabIndex={0} onClick={onClick} onKeyDown={k} aria-pressed={active} className={paneSelectClass(active)}>
      <span className={r1}><strong className={nm}>{item.name}</strong><PaneStatusBadge status={item.status} /></span>
      <span className={r2}><PaneMeta item={item} /></span>
    </div>
  )
}
