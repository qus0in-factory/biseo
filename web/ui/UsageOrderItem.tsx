import r from '../resources.json'

type P = { id: string; hidden: boolean; onMove: (dir: number) => void; onToggleHide: () => void }

export function UsageOrderItem({ id, hidden, onMove, onToggleHide }: P) {
  return (
    <li className="flex items-center justify-between gap-2 rounded border px-2 py-1">
      <span className={hidden ? 'text-muted-foreground line-through' : ''}>{id}</span>
      <span className="flex gap-1">
        <button type="button" aria-label={r.usageMoveLeft} onClick={() => onMove(-1)}>←</button>
        <button type="button" aria-label={r.usageMoveRight} onClick={() => onMove(1)}>→</button>
        <button type="button" onClick={onToggleHide}>{hidden ? r.usageShowItem : r.usageHideItem}</button>
      </span>
    </li>
  )
}
