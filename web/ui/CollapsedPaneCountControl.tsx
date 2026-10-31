import r from '../resources.json'
type P = { count: number; onDecrease: () => void; onIncrease: () => void; canDecrease: boolean; canIncrease: boolean }
export function CollapsedPaneCountControl({ count, onDecrease, onIncrease, canDecrease, canIncrease }: P) {
  return (
    <div className="inline-flex items-center gap-1" aria-label={r.collapsedPanesAria}>
      <button type="button" aria-label={r.collapsedPanesDecrease} disabled={!canDecrease} onClick={onDecrease} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border disabled:opacity-40">-</button>
      <span className="min-w-6 text-center text-sm" aria-live="polite">{count}</span>
      <button type="button" aria-label={r.collapsedPanesIncrease} disabled={!canIncrease} onClick={onIncrease} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border disabled:opacity-40">+</button>
    </div>
  )
}
