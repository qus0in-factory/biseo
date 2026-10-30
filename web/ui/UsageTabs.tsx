import { Tabs } from '../components/ui/tabs'
import { UsageTabList } from './UsageTabList'
import { UsageTabContent } from './UsageTabContent'
type P = { providers: any[]; bookmarks: string[]; onToggleBookmark: (id: string) => void; remaining: boolean; tab: string; onTabChange: (v: string) => void }
export function UsageTabs({ providers, bookmarks, onToggleBookmark, remaining, tab, onTabChange }: P) {
  const activeTab = providers.some((p: any) => p.provider === tab) ? tab : 'bookmarked'
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <UsageTabList providers={providers} bookmarks={bookmarks} onToggleBookmark={onToggleBookmark} />
      <UsageTabContent providers={providers} bookmarks={bookmarks} remaining={remaining} />
    </Tabs>
  )
}