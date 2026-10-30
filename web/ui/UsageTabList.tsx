import { Star } from 'lucide-react'
import { TabsList, TabsTrigger } from '../components/ui/tabs'
import type { UsageProvider } from '../domain/usage'
import r from '../resources.json'

type P = { providers: UsageProvider[]; bookmarks: string[]; onToggleBookmark: (id: string) => void }

export function UsageTabList({ providers, bookmarks, onToggleBookmark }: P) {
  return (
    <TabsList className="mb-2 flex-wrap">
      <TabsTrigger value="bookmarked">{r.usageBookmarkedTab}</TabsTrigger>
      {providers.map((p) => (
        <TabsTrigger key={p.provider} value={p.provider} className="gap-1">
          <button type="button" aria-label={r.usageBookmarkAria} aria-pressed={bookmarks.includes(p.provider)}
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(p.provider) }}>
            <Star size={14} className={bookmarks.includes(p.provider) ? 'fill-current' : ''} />
          </button>
          {p.provider}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
