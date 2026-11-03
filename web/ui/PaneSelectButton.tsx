import type { PaneSummary } from '../domain/timeline'
import { PaneMeta } from './PaneMeta'
import { PaneStatusBadge } from './PaneStatusBadge'
import { paneSelectClass, paneSelectTarget, paneSelectRow, paneSelectName } from './paneSelectClass'

type P = { item: PaneSummary; active: boolean; onClick: () => void }

export function PaneSelectButton({ item, active, onClick }: P) {
  return (
    <div className={paneSelectClass(active)}>
      <button type="button" onClick={onClick} onKeyDown={e => e.stopPropagation()} aria-label={item.name} aria-pressed={active} className={paneSelectTarget} />
      <span className={paneSelectRow}><strong className={paneSelectName}>{item.name}</strong><PaneStatusBadge status={item.status} blockedReason={item.blockedReason} /></span>
      <span className={paneSelectRow}><PaneMeta item={item} /></span>
    </div>
  )
}
