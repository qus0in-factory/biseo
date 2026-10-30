import type { UsageProvider } from '../domain/usage'
import { UsageTabList } from './UsageTabList'
import r from '../resources.json'

type P = {
  providers: UsageProvider[]
  bookmarks: string[]
  onToggleBookmark: (id: string) => void
  step: (dir: number) => void
}

export function UsageTabStrip({ providers, bookmarks, onToggleBookmark, step }: P) {
  return (
    <div className="mb-2 flex items-center gap-1">
      <button type="button" className="shrink-0 p-1" aria-label={r.usageTabPrev} onClick={() => step(-1)}>←</button>
      <UsageTabList providers={providers} bookmarks={bookmarks} onToggleBookmark={onToggleBookmark} />
      <button type="button" className="shrink-0 p-1" aria-label={r.usageTabNext} onClick={() => step(1)}>→</button>
    </div>
  )
}
