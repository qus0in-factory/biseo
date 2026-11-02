import type { UsageProvider } from '../domain/usage'
import { UsageTabList } from './UsageTabList'

type P = {
  providers: UsageProvider[]
  bookmarks: string[]
  onToggleBookmark: (id: string) => void
  onMove: (from: number, to: number) => void
}

export function UsageTabStrip({ providers, bookmarks, onToggleBookmark, onMove }: P) {
  return (
    <div className="mb-2 flex min-w-0 items-center">
      <UsageTabList
        providers={providers}
        bookmarks={bookmarks}
        onToggleBookmark={onToggleBookmark}
        onMove={onMove}
      />
    </div>
  )
}
