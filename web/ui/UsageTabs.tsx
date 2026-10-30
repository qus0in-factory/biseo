import { Tabs } from '../components/ui/tabs'
import { UsageTabList } from './UsageTabList'
import { UsageTabContent } from './UsageTabContent'
import type { UsageProvider } from '../domain/usage'

type P = {
  providers: UsageProvider[]
  bookmarks: string[]
  onToggleBookmark: (id: string) => void
  remaining: boolean
  tab: string
  onTabChange: (v: string) => void
}

export function UsageTabs({ providers, bookmarks, onToggleBookmark, remaining, tab, onTabChange }: P) {
  const activeTab = providers.some((p) => p.provider === tab) ? tab : 'bookmarked'
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <UsageTabList providers={providers} bookmarks={bookmarks} onToggleBookmark={onToggleBookmark} />
      <UsageTabContent providers={providers} bookmarks={bookmarks} remaining={remaining} />
    </Tabs>
  )
}
