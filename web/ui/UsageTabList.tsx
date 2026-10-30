import { TabsList, TabsTrigger } from '../components/ui/tabs'
import type { UsageProvider } from '../domain/usage'
import { UsageBookmarkStar } from './UsageBookmarkStar'
import r from '../resources.json'

type P = { providers: UsageProvider[]; bookmarks: string[]; onToggleBookmark: (id: string) => void }

export function UsageTabList({ providers, bookmarks, onToggleBookmark }: P) {
  return (
    <TabsList className="min-w-0 flex-1 flex-nowrap justify-start overflow-x-auto">
      <TabsTrigger value="bookmarked" className="shrink-0">{r.usageBookmarkedTab}</TabsTrigger>
      {providers.map((p) => (
        <TabsTrigger key={p.provider} value={p.provider} className="shrink-0 gap-1">
          <UsageBookmarkStar marked={bookmarks.includes(p.provider)} onToggle={() => onToggleBookmark(p.provider)} />
          {p.provider}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
