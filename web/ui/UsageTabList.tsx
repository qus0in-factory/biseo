import { TabsList, TabsTrigger } from '../components/ui/tabs'
import type { UsageProvider } from '../domain/usage'
import { UsageBookmarkStar } from './UsageBookmarkStar'
import { SortableItem } from './sortable/SortableItem'
import { SortableList } from './sortable/SortableList'
import r from '../resources.json'

type P = {
  providers: UsageProvider[]
  bookmarks: string[]
  onToggleBookmark: (id: string) => void
  onMove: (from: number, to: number) => void
}

export function UsageTabList({ providers, bookmarks, onToggleBookmark, onMove }: P) {
  const ids = providers.map((p) => p.provider)
  return (
    <TabsList className="min-w-0 flex-1 flex-nowrap justify-start overflow-x-auto">
      <TabsTrigger value="bookmarked" className="shrink-0">{r.usageBookmarkedTab}</TabsTrigger>
      <SortableList ids={ids} axis="horizontal" onReorder={onMove}>
        {providers.map((p) => (
          <SortableItem key={p.provider} id={p.provider}>
            {(sortable) => (
              <TabsTrigger
                ref={sortable.ref}
                value={p.provider}
                style={sortable.style}
                {...sortable.attributes}
                {...sortable.listeners}
                role="tab"
                className="shrink-0 touch-manipulation gap-1"
              >
                <UsageBookmarkStar marked={bookmarks.includes(p.provider)} onToggle={() => onToggleBookmark(p.provider)} />
                {p.provider}
              </TabsTrigger>
            )}
          </SortableItem>
        ))}
      </SortableList>
    </TabsList>
  )
}
