import r from '../resources.json'

type P = { id: string; hidden: boolean; onMove?: (dir: number) => void; onToggleHide: () => void; draggable?: boolean; onDragStart?: () => void; onDragOver?: (ev: any) => void; onDragEnd?: () => void }

export function UsageOrderItem({ id, hidden, onMove, onToggleHide, draggable, onDragStart, onDragOver, onDragEnd }: P) {
  return (
    <li className="flex items-center justify-between gap-2 rounded border px-2 py-1" draggable={draggable} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
      <span className={hidden ? 'text-muted-foreground line-through' : ''}>{id}</span>
      <span className="flex gap-1">
        {onMove ? <button type="button" aria-label={r.usageMoveLeft} onClick={() => onMove(-1)}>←</button> : null}
        {onMove ? <button type="button" aria-label={r.usageMoveRight} onClick={() => onMove(1)}>→</button> : null}
        <button type="button" onClick={onToggleHide}>{hidden ? r.usageShowItem : r.usageHideItem}</button>
      </span>
    </li>
  )
}
