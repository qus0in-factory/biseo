import { Star } from 'lucide-react'
import { TabsList, TabsTrigger } from '../components/ui/tabs'
import r from '../resources.json'
const res = r as any
export function UsageTabList({ providers, bookmarks, onToggleBookmark }: { providers: any[]; bookmarks: string[]; onToggleBookmark: (id: string) => void }) {
  return (
    <TabsList className="mb-2 flex-wrap">
      <TabsTrigger value="bookmarked">{res.usageBookmarkedTab}</TabsTrigger>
      {providers.map((p: any) => (
        <TabsTrigger key={p.provider} value={p.provider} className="gap-1">
          <button type="button" aria-label={res.usageBookmarkAria} aria-pressed={bookmarks.includes(p.provider)}
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(p.provider) }}>
            <Star size={14} className={bookmarks.includes(p.provider) ? 'fill-current' : ''} />
          </button>
          {p.provider}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}