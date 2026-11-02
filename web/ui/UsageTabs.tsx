import { Tabs } from '../components/ui/tabs'
import { UsageTabStrip } from './UsageTabStrip'
import { UsageTabContent } from './UsageTabContent'
import type { UsageProvider } from '../domain/usage'

export type UsageTabsProps = {
  providers: UsageProvider[]
  bookmarks: string[]
  onToggleBookmark: (id: string) => void
  remaining: boolean
  tab: string
  onTabChange: (v: string) => void
  onMove: (from: number, to: number) => void
}

export function UsageTabs({ providers, bookmarks, onToggleBookmark, remaining, tab, onTabChange, onMove }: UsageTabsProps) {
  const activeTab = providers.some((p) => p.provider === tab) ? tab : 'bookmarked'
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <UsageTabStrip
        providers={providers}
        bookmarks={bookmarks}
        onToggleBookmark={onToggleBookmark}
        onMove={onMove}
      />
      <UsageTabContent providers={providers} bookmarks={bookmarks} remaining={remaining} />
    </Tabs>
  )
}
