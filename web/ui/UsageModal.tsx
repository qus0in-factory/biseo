import { useState } from 'react'
import { Star } from 'lucide-react'
import { Modal } from './Modal'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { UsagePanelRow } from './UsagePanelRow'
import { useUsage } from '../app/useUsage'
import { usageApi } from '../infra/usageApi'
import { useUsageBookmarks } from '../app/useUsageBookmarks'
import { useUsageMode } from '../app/useUsageMode'
import r from '../resources.json'

const res = r as any

export function UsageModal({ open, onClose, enabled = true }: { open: boolean; onClose: () => void; enabled?: boolean }) {
  const { providers } = useUsage(usageApi, enabled && open)
  const { bookmarks, toggle } = useUsageBookmarks()
  const { remaining, toggle: toggleMode } = useUsageMode()
  const [tab, setTab] = useState<string>('bookmarked')
  const bookmarked = providers.filter((p) => bookmarks.includes(p.provider))
  const activeTab = providers.some((p) => p.provider === tab) ? tab : 'bookmarked'
  return (
    <Modal open={open} title={res.usageTitle} onClose={onClose}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{remaining ? res.usageRemaining : res.usageUsed}</span>
        <button
          type="button"
          role="switch"
          aria-checked={remaining}
          aria-label={remaining ? res.usageRemaining : res.usageUsed}
          className="relative flex h-11 w-14 shrink-0 cursor-pointer items-center justify-between rounded-full border border-border bg-surface px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onClick={toggleMode}
        >
          <span className="relative z-10 text-xs">{remaining ? 'R' : 'U'}</span>
          <span aria-hidden="true" className={`absolute left-1 top-1 h-9 w-6 rounded-full border border-border bg-card shadow-sm transition-transform ${remaining ? '' : 'translate-x-6'}`} />
        </button>
      </div>
      <Tabs value={activeTab} onValueChange={setTab}>
        <TabsList className="mb-2 flex-wrap">
          <TabsTrigger value="bookmarked">{res.usageBookmarkedTab}</TabsTrigger>
          {providers.map((p) => (
            <TabsTrigger key={p.provider} value={p.provider}>
              <button
                type="button"
                aria-label={res.usageBookmarkAria}
                aria-pressed={bookmarks.includes(p.provider)}
                onClick={(e) => { e.stopPropagation(); toggle(p.provider) }}
                className="mr-1"
              >
                <Star size={14} className={bookmarks.includes(p.provider) ? 'fill-current' : ''} />
              </button>
              {p.provider}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="bookmarked">
          {bookmarked.length === 0 ? (
            <p className="text-sm text-muted-foreground">{res.usageBookmarkEmpty}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {bookmarked.map((p) => (
                <UsagePanelRow key={p.provider} provider={p} remaining={remaining} />
              ))}
            </div>
          )}
        </TabsContent>
        {providers.map((p) => (
          <TabsContent key={p.provider} value={p.provider}>
            <UsagePanelRow provider={p} remaining={remaining} />
          </TabsContent>
        ))}
      </Tabs>
    </Modal>
  )
}